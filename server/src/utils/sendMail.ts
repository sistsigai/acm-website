import nodemailer from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/* ---------------- EVENT / SYSTEM MAIL ---------------- */
export const sendEventMail = async ({
  to,
  subject,
  html,
}: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SIST ACM SIGAI" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};

/* ---------------- CONTACT / ENQUIRY MAIL ---------------- */
export const sendContactMail = async ({
  to,
  subject,
  html,
  replyTo,
}: MailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.CONTACT_MAIL_USER,
      pass: process.env.CONTACT_MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SIGAI Contact Desk" <${process.env.CONTACT_MAIL_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });
};
