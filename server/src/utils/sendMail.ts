import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

let transporterInstance: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return transporterInstance;
};

/* ---------------- EVENT / SYSTEM MAIL ---------------- */
export const sendEventMail = async ({
  to,
  subject,
  html,
  replyTo,
}: MailOptions): Promise<void> => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"SIST ACM SIGAI" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
};

