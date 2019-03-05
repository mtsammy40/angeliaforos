var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mailTo = require('../components/mailer');
var Voter = require('../db/voterModel');
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/data', function(req, res, next) {
  Voter.find({}, (err, voter)=>{
    res.send(voter);
  });
});
router.post('/getdp', (req, res, next)=>{
  var id = req.body.id;
  Voter.findOne({ id : id}, (err, doc)=>{
    if(err) throw err;
    res.sendFile(doc.dp);
    console.log('my dp', doc.dp);
  })
})
router.post('/newAdmin', upload.single('dp'), function(req, res, next){
  const tempPath = req.file.path;
  var id = req.body.id;
  var ext = path.extname(req.file.originalname).toLowerCase();
  const targetPath = path.join(__dirname, "../uploads/"+id+ext);
  var name = req.body.name;
  if(ext === ".png" || ext === ".jpg"){
    fs.rename(tempPath, targetPath, err => {
      if (err) throw err;
      var newVoter = new Voter();
      newVoter.name = name;
      newVoter.id = id;
      newVoter.dp = targetPath;
      newVoter.save(err=>{
        if(err) throw err;
        Voter.find({id : id}, (err, doc)=>{
          if(err) throw err;
          res.send(doc);
        })
      })
    });
  } else {
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
  });
}
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
