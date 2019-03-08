var nodemailer = require('nodemailer');

function mailTo(receipient, subject, text, attachments){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mtsammy40@gmail.com',
          pass: 'aweSAM40'
        }
      });
      var mailOptions = {
        from: 'mtsammy40@gmail.com',
        to: receipient,
        subject: subject,
        text: text,
        attachments: attachments
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return 'There was an error. Please check data '+error;
        } else {
          console.log('Email sent: ' + info.response);
          return info.response;
        }
      });
}
module.exports.mailTo = mailTo;