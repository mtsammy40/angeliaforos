var nodemailer = require('nodemailer');

module.exports = {
  mailTo : async function (recipient, subject, text, attachments, html, res){
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
      html: html,
      attachments: attachments
    };
    var result;
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        
        result = false;
      } else {
        console.log('Email sent:' + info.response);
        
        result = true;
      }
    });
    return result;
}
}