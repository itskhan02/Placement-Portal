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

  const config = {
    user,
    pass,
    resendApiKey,
    provider: provider || (resendApiKey ? "resend" : "gmail"),
    from: fromAddress ? `"Smart Place" <${fromAddress}>` : "",
  };

  console.log("[Email Config]", {
    provider: config.provider,
    userConfigured: Boolean(user),
    passConfigured: Boolean(pass),
    resendApiKeyConfigured: Boolean(resendApiKey),
    fromConfigured: Boolean(config.from),
  });

  return config;
};

const createTransporter = () => {
  const { provider, user, pass, resendApiKey } = getMailConfig();

  if (provider === "resend") {
    if (!resendApiKey) {
      throw new Error("Resend email service is not configured - missing RESEND_API_KEY");
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

  if (!user) {
    throw new Error("Gmail email service is not configured - missing EMAIL_USER");
  }

  if (!pass) {
    throw new Error("Gmail email service is not configured - missing EMAIL_PASS. Use app-specific password for Gmail");
  }

  try {
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
    console.log("[Nodemailer] Transporter created successfully for:", user);
    return transporter;
  } catch (err) {
    throw new Error(`Failed to create nodemailer transporter: ${err.message}`);
  }
};

module.exports = { createTransporter, getMailConfig };
