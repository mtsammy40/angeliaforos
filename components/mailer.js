var nodemailer = require('nodemailer');

module.exports = {
  mailTo : function (recipient, subject, text, attachments){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mtsammy40@gmail.com',
          pass: 'aweSAM40'
        }
      });
      var mailOptions = {
        from: 'Bitpoll',
        to: recipient,
        subject: subject,
        text: text,
        attachments: attachments
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return false;
        } else {
          console.log('Email sent:' + info.response);
          return true;
        }
      });
}
}