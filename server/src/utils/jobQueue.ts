import QRCode from "qrcode";
import { sendEventMail } from "./sendMail";
import cloudinary from "./cloudinary";
import streamifier from "streamifier";
import Registration from "../models/Registration";

interface RegistrationPassJobData {
  registrationId: string;
  qrPayloadString: string;
  email: string;
  name: string;
  eventName: string;
  eventDate: string;
  venue: string;
  time: string;
}

interface Job {
  id: string;
  type: "SEND_REGISTRATION_PASS";
  data: RegistrationPassJobData;
  attempts: number;
  maxAttempts: number;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: number;
  lastError?: string;
}

class BackgroundJobQueue {
  private queue: Job[] = [];
  private isProcessing = false;
  private concurrency = 2;
  private activeCount = 0;

  public enqueueRegistrationPass(data: RegistrationPassJobData) {
    const job: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "SEND_REGISTRATION_PASS",
      data,
      attempts: 0,
      maxAttempts: 3,
      status: "queued",
      createdAt: Date.now(),
    };

    this.queue.push(job);
    console.log(`📥 [JobQueue] Enqueued job ${job.id} for ${data.email} (${data.eventName})`);
    this.processNext();
    return job.id;
  }

  private async processNext() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeCount++;
    job.status = "processing";
    job.attempts++;

    try {
      console.log(`⚙️ [JobQueue] Processing job ${job.id} (Attempt ${job.attempts}/${job.maxAttempts})`);

      if (job.type === "SEND_REGISTRATION_PASS") {
        await this.handleRegistrationPassJob(job.data);
      }

      job.status = "completed";
      console.log(`✅ [JobQueue] Successfully finished job ${job.id} for ${job.data.email}`);
    } catch (err: any) {
      console.error(`❌ [JobQueue] Job ${job.id} failed:`, err?.message || err);
      job.lastError = err?.message || String(err);

      if (job.attempts < job.maxAttempts) {
        const retryDelay = Math.pow(2, job.attempts) * 1000; // Exponential backoff (2s, 4s, 8s)
        console.log(`🔄 [JobQueue] Re-queueing job ${job.id} after ${retryDelay}ms delay...`);
        setTimeout(() => {
          this.queue.push(job);
          this.processNext();
        }, retryDelay);
      } else {
        job.status = "failed";
        console.error(`🚨 [JobQueue] Job ${job.id} permanently failed after ${job.maxAttempts} attempts.`);
      }
    } finally {
      this.activeCount--;
      this.processNext();
    }
  }

  private async handleRegistrationPassJob(data: RegistrationPassJobData) {
    // 1. Generate QR Code Buffer
    const qrBuffer = await QRCode.toBuffer(data.qrPayloadString, {
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });

    // 2. Upload to Cloudinary for permanent storage
    const uploadToCloudinary = (buffer: Buffer): Promise<{ secure_url: string; public_id: string }> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "event_qrcodes",
            public_id: `qr_${data.registrationId}_${Date.now()}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("Cloudinary upload returned null"));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    let qrCodeUrl = "";
    try {
      const uploadRes = await uploadToCloudinary(qrBuffer);
      qrCodeUrl = uploadRes.secure_url;
      // Update registration with QR code URL
      await Registration.findByIdAndUpdate(data.registrationId, {
        qrCodeUrl: qrCodeUrl,
      });
    } catch (uploadError) {
      console.warn("⚠️ Cloudinary upload warning in JobQueue (falling back to direct base64 pass):", uploadError);
    }

    // 3. Send email with QR code pass attachment
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0c16; color: #f8fafc; padding: 24px; border-radius: 12px;">
        <h2 style="color: #00f0ff;">SIST ACM SIGAI - Event Pass</h2>
        <p>Hello <strong>${data.name}</strong>,</p>
        <p>Your registration for <strong>${data.eventName}</strong> has been confirmed!</p>
        <div style="background-color: #131527; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;">📅 <strong>Date:</strong> ${data.eventDate}</p>
          <p style="margin: 4px 0;">⏰ <strong>Time:</strong> ${data.time}</p>
          <p style="margin: 4px 0;">📍 <strong>Venue:</strong> ${data.venue}</p>
        </div>
        <p>Please find your entry QR Pass attached to this email. Present it at the entrance for verification.</p>
        <br />
        <p style="color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} SIST ACM SIGAI Student Chapter</p>
      </div>
    `;

    await sendEventMail({
      to: data.email,
      subject: `Your Event Pass | ${data.eventName}`,
      html: emailHtml,
      attachments: [
        {
          filename: `ticket_${data.registrationId}.png`,
          content: qrBuffer,
          cid: "ticketQrPass",
        },
      ],
    });
  }
}

export const jobQueue = new BackgroundJobQueue();
