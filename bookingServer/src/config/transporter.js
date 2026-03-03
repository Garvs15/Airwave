const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = require('./serverConfig');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
  }
});

module.exports = transporter