const { createTransporter, getMailConfig } = require("./mailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    const { from } = getMailConfig();

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("Email Error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
