const nodemailer = require("nodemailer");
const { Resend } = require("resend");

const getMailConfig = () => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").trim();
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const provider = (process.env.EMAIL_PROVIDER || "").trim().toLowerCase();
  const fromAddress = (
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    user
  ).trim();

  return {
    user,
    pass,
    resendApiKey,
    provider: provider || (resendApiKey ? "resend" : "gmail"),
    from: fromAddress ? `"Smart Place" <${fromAddress}>` : "",
  };
};

const createTransporter = () => {
  const { provider, user, pass, resendApiKey } = getMailConfig();

  if (provider === "resend") {
    if (!resendApiKey) {
      throw new Error("Resend email service is not configured");
    }

    return {
      provider,
      sendMail: ({ from, to, subject, text, html }) => {
        const resend = new Resend(resendApiKey);
        return resend.emails.send({
          from,
          to,
          subject,
          text,
          html,
        });
      },
    };
  }

  if (!user || !pass) {
    throw new Error("Gmail email service is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.provider = "gmail";
  return transporter;
};

module.exports = { createTransporter, getMailConfig };
