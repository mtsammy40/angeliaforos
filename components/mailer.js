var nodemailer = require('nodemailer');
var mailgunTransport = require('nodemailer-mailgun-transport');

module.exports = {
  mailTo: function (recipient, subject, text, attachments, html) {
    var transporter = nodemailer.createTransport({
      service: 'mailgun',
      auth: {
        user: 'mtsammy40@gmail.com',
        pass: 'aweSAM40'
      }
    });
    var mailOptions = {
      from: 'Bitpoll<mtsammy40@gmail.com>',
      to: recipient,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments
    };
    var result;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        result = false;
        return false;
      } else {
        console.log('Email sent:' + info.response);
        result = true;
        return true;
      }
    });
    return result;
  },

  MGmailTo: function (recipient, subject, text, attachments, html) {
    const mailgunOptions = {
      auth:{
        api_key: '174e4bd069bdc8196e145974d98cf4f2-e51d0a44-6a50780c',
        domain: 'sandbox321d91e5ea8340069fe8542243a5d907.mailgun.org'
      }
    }
    const transport = mailgunTransport(mailgunOptions);
    class EmailService {
      constructor(){
        this.emailClient = nodemailer.createTransport(transport)
      }
      sendma()
    }
  }

}