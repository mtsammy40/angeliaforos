var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mailTo = require('../components/mailer');
var Voter = require('../db/voterModel');
var Admin = require('../db/pendingAdmin');
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

router.post('/NewPendingAdmin', function(req, res, next){
  var newAdmin = new Admin();
  newAdmin.name =  req.body.name;
  newAdmin.id = req.body.id;
  newAdmin.dob = req.body.dob;
  newAdmin.county = req.body.county;
  newAdmin.phoneNo = req.body.phoneNo;
  newAdmin.dp = req.body.gender;
  newAdmin.gender = req.body.gender;
  newAdmin.email = req.body.email;
  newAdmin.nationality = req.body.nationality;
  newAdmin.institution = req.body.institution;
  console.log('newAdmin', newAdmin);
  newAdmin.save(err=>{
    if (err){
      console.log('error 200', err);
    }
    res.send('We are sending');
  });
});
router.get('/pendingAdmin', (req, res)=>{
  Admin.findOne({ id: req.param('id')}, (err, doc)=>{
    if(err){
      res.status(500);
      throw err;
    } 
    res.status('200').send(doc);
  });
});
router.post('/approveAdmin', (req, res)=>{
  Admin.findOneAndUpdate({ id: req.id }, { approved: true}, (err)=>{
    if(err) throw err;
    axios
    res.status(200).send('Admin Approved');
  })
});
router.post('/sendIdentity', upload.single('dp'), (res, req)=>{
  const tempPath = req.file.path;
  var name = req.body.name;
  var email = req.body.email;
  var subject = "You have been approved as an Institution ADMIN";
  var text = "Find attached your identity. Download it and upload it when promted! Keep it secret!!!";
  attachments=[
    {   // file on disk as an attachment
      filename: name,
      path: tempPath // stream this file
  },
  ];
  var email = mailTo(email, subject, text, attachments);
  res.send(email);
})
router.get('/AllPendingAdmins/', (req, res)=>{
  Admin.find({ approved: false }, (err, doc)=>{
    if(err) throw err;
    res.status(200).send(doc);
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
