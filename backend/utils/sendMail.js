const transporter = require("./mailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: `"Smart Place" <${process.env.EMAIL_USER}>`,
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
