const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, link) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Update Password",
    html: `
      <h3>Update Password</h3>
      <p>Click below link:</p>
      <a href="${link}">${link}</a>
    `,
  });
};

module.exports = { sendResetEmail };
