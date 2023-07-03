const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (dataSendEmail, req, res) => {
  let transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"OPTECH COMPANY" <admin@optech.vn>', // sender address
    to: dataSendEmail.to,
    subject: dataSendEmail.subject,
    text: dataSendEmail.text,
    html: dataSendEmail.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
