import { Request, Response } from "express";
import Userquery, { IContact } from "../models/Contact";
import { sendContactMail } from "../utils/sendMail";

/* ---------------- GET ALL MESSAGES ---------------- */
export const getMessages = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const messages: IContact[] = await Userquery.find()
            .sort({ createdAt: -1 })
            .lean();

        // Map DB fields → UI-friendly fields
        const formattedMessages = messages.map(msg => ({
            _id: msg._id,
            name: `${msg.Firstname} ${msg.Lastname}`,
            email: msg.Email,
            subject: "Website Enquiry",
            message: msg.Message,
            createdAt: msg.createdAt,
            isRead: msg.isRead,
        }));

        res.status(200).json({
            success: true,
            messages: formattedMessages,
        });
    } catch (error: any) {
        console.error("Get Messages Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enquiries",
        });
    }
};

/* ---------------- TOGGLE READ / UNREAD ---------------- */
export const toggleMessageRead = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const enquiry = await Userquery.findById(id);
        if (!enquiry) {
            res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
            return;
        }

        enquiry.isRead = !enquiry.isRead;
        await enquiry.save();

        res.status(200).json({
            success: true,
            message: enquiry.isRead ? "Marked as read" : "Marked as unread",
            isRead: enquiry.isRead,
        });
    } catch (error) {
        console.error("Toggle Read Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update read status",
        });
    }
};

/* ---------------- DELETE MESSAGE ---------------- */
export const deleteMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const deleted = await Userquery.findByIdAndDelete(id);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Enquiry deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete Enquiry Error:", error);
        res.status(400).json({
            success: false,
            message: "Failed to delete enquiry",
        });
    }
};

/* ---------------- SEND AUTO REPLY ---------------- */
export const sendAutoReply = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        /* ---------------- FIND ENQUIRY ---------------- */
        const enquiry = await Userquery.findById(id);
        if (!enquiry) {
            res.status(404).json({
                success: false,
                message: "Enquiry not found",
            });
            return;
        }

        const fullName = `${enquiry.Firstname} ${enquiry.Lastname}`;

        /* ---------------- AUTO-REPLY TEMPLATE ---------------- */
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Acknowledgement</title>
  <style>
    @keyframes slideUpFade {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-card {
      animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ecf0f3; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ecf0f3; padding:40px 0;">
    <tr>
      <td align="center">

        <table class="animate-card" cellpadding="0" cellspacing="0" border="0"
          style="
            width:100%;
            max-width:600px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05), 0 5px 10px rgba(0,0,0,0.01);
            border: 1px solid #ffffff;
            opacity: 1;
          "
        >

          <tr>
            <td style="
              background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
              padding: 30px 40px;
              text-align: center;
            ">
              <img
                src="https://res.cloudinary.com/dxpglrdwn/image/upload/v1767077893/acm-logo_x9u2js.png"
                alt="SIGAI Logo"
                width="60"
                height="60"
                style="
                  display: block;
                  margin: 0 auto 15px auto;
                  border-radius: 12px;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                "
              />
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                Thank You for Contacting Us
              </h1>
              <p style="margin: 8px 0 0; color: #dbeafe; font-size: 14px; font-weight: 400;">
                We have received your enquiry
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px; color: #334155; font-size: 15px; line-height: 1.6;">

              <p style="margin-top: 0;">Hello <strong>${fullName}</strong>,</p>

              <p>
                Thank you for reaching out to the <strong>SIST ACM SIGAI STUDENT CHAPTER</strong>.
                We have successfully received your message and appreciate you contacting us.
              </p>

              <p>
                Our team is currently reviewing your query and will get back to you as soon as possible.
              </p>

              <div style="margin: 30px 0; border-top: 1px solid #e2e8f0;"></div>

              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 25px;">
                <em>This is an automated acknowledgement email. Please do not reply directly to this message.</em>
              </p>

              <p style="margin-bottom: 0;">
                Warm regards,<br />
                <span style="color: #64748b; font-size: 14px;">SIST ACM SIGAI Student Chapter</span>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 5px 0 0; font-size: 11px; color: #cbd5e1;">
                © ${new Date().getFullYear()} SIST ACM SIGAI STUDENT CHAPTER
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

        /* ---------------- SEND MAIL ---------------- */
        await sendContactMail({
            to: enquiry.Email,
            subject: "We’ve received your enquiry | SIGAI Events",
            html,
        });

        /* ---------------- OPTIONAL: MARK AS READ ---------------- */
        if (!enquiry.isRead) {
            enquiry.isRead = true;
            await enquiry.save();
        }

        /* ---------------- RESPONSE ---------------- */
        res.status(200).json({
            success: true,
            message: "Auto reply sent successfully",
        });
    } catch (error) {
        console.error("❌ Send Auto Reply Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send auto reply",
        });
    }
};