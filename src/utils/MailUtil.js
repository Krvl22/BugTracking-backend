const mailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const mailSend = async (to, subject, html) => {
  try{
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  };

  const mailResponse = await transporter.sendMail(mailOptions);
  console.log(mailResponse);
  return mailResponse;
  }
  catch(err){
    console.error("Mail Error:", err.message);
    throw err;
  }

}
const getWelcomeEmailHtml = (role = "Developer") => {
  const templatePath = path.join(__dirname, "welcome-email.html");
  let html = fs.readFileSync(templatePath, "utf8");
  html = html.replace(
    />Developer</,
    `>${role}<`
  );
  return html;
};

module.exports = { mailSend, getWelcomeEmailHtml };
