const nodemailer = require("nodemailer");

const getMailConfig = () => {
  const user = (process.env.EMAIL_USER || "").trim();
  const pass = (process.env.EMAIL_PASS || "").trim();
  const from = (process.env.EMAIL_FROM || user).trim();

  return {
    user,
    pass,
    from: from ? `"Smart Place" <${from}>` : "",
  };
};

const createTransporter = () => {
  const { user, pass } = getMailConfig();

  if (!user || !pass) {
    throw new Error("Email service is not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

module.exports = { createTransporter, getMailConfig };
