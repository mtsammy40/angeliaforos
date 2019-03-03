var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mailTo = require('../components/mailer');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/newAdmin', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  mailTo(req.body.email, 'Your Bitpoll Secret Identity', 'Please Keep this Private');
});
router.get('/sendMail', function(req, res, next) {
  var emailto = req.param('email');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mtsammy40@gmail.com',
      pass: 'aweSAM40'
    }
  });
  
  var mailOptions = {
    from: 'mtsammy40@gmail.com',
    to: emailto,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.send('There was an error. Please check data'+error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent');
    }
  });
});

module.exports = router;
