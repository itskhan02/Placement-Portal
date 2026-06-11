const { createTransporter, getMailConfig } = require("./mailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("[Email] Attempting to send email to:", to);
    
    const transporter = createTransporter();
    const { from, provider } = getMailConfig();

    if (!from) {
      throw new Error("Email sender address is not configured - EMAIL_FROM or RESEND_FROM_EMAIL not set");
    }

    console.log("[Email] Using provider:", provider);
    
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("[Email] Email sent successfully to:", to);
  } catch (err) {
    const { provider, user, resendApiKey, from } = getMailConfig();

    console.error("[Email Error] Full Error Object:", {
      provider,
      fromConfigured: Boolean(from),
      gmailUserConfigured: Boolean(user),
      resendConfigured: Boolean(resendApiKey),
      errorCode: err.code,
      errorCommand: err.command,
      errorResponseCode: err.responseCode,
      errorMessage: err.message,
      errorType: err.constructor.name,
      errorStack: err.stack,
    });
    throw err;
  }
};

module.exports = sendEmail;
