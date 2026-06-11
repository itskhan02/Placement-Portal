const { createTransporter, getMailConfig } = require("./mailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    const { from, provider } = getMailConfig();

    if (!from) {
      throw new Error("Email sender address is not configured");
    }

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    const { provider, user, resendApiKey, from } = getMailConfig();

    console.error("Email Error:", {
      provider,
      fromConfigured: Boolean(from),
      gmailUserConfigured: Boolean(user),
      resendConfigured: Boolean(resendApiKey),
      code: err.code,
      command: err.command,
      responseCode: err.responseCode,
      message: err.message,
    });
    throw err;
  }
};

module.exports = sendEmail;
