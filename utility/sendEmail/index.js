const nodemailer = require('nodemailer');
const Email = require('email-templates');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASSWORD
    }
  });


module.exports = (template, to, subject, name, verifyLink, url) => {
  return transport.sendMail({
      from: 'authnodejs2@gmail.com',
      to,
      subject,
      text: ` Click on the following link: ${verifyLink}`
  });
};
