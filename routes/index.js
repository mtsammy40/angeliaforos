var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var mail = require('../components/mailer');
var Voter = require('../db/voterModel');
var Admin = require('../db/pendingAdmin');
var Election = require('../db/electionModel');
var votes = require('../db/votes');
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
  newAdmin.approved = false;
  console.log('newAdmin', newAdmin);
  newAdmin.save(err=>{
    if (err){
      console.log('error 200', err);
    }
    res.send('We are sending');
  });
});
router.get('/pendingAdmin', (req, res, next)=>{
  Admin.findOne({ id: req.param('id')}, (err, doc)=>{
    if(err){
      res.status(500);
      throw err;
    } 
    res.status('200').send(doc);
  });
});
router.post('/approveAdmin', (req, res)=>{
  var aid = req.body.id;
  Admin.findOneAndUpdate({ id : aid}, {$set:{ approved: true }}, { new: true }, (err, doc)=>{
    if(err){
      res.status(500).send(err);
      throw err;
    } else {
      res.status(200).send(doc);
      console.log('doc is :', doc);
    }
  });
});

router.post('/sendIdentity', upload.single('data'), (req, res)=>{
  var tempPath = req.file.path;
  console.log('path file', tempPath);
  var name = req.body.name;
  var dest = req.body.email;
  console.log('dest', req.body);
  var subject = "You have been approved as an Institution ADMIN";
  var text = "Find attached your identity. Download it and upload it when promted! Keep it secret!!!";
  var attachments= [
    {   // utf-8 string as an attachment
      filename: name+'.card',
      path: tempPath
    },
  ];
  var mailed = mail.mailTo(dest, subject, text, attachments);
  if (mailed){
    res.status(200).send('mail sent to ' + email);
  } else {
    res.status(500).send('Failed to send email to : ' + dest);
  }
});
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
router.post('/newVote', (req, res, next)=>{
  var newVote = new votes();
  newVote.election = req.body.election;
  newVote.candidate = req.body.candidate;
  newVote.gender = req.body.gender;
  newVote.age = req.body.age;
  newVote.candNo = req.body.candidateNo;
  newVote.save(err=>{
    if(err){
      throw err;
    } else {
      res.status(200).send('Successfully Saved');
    }
  })
});
router.post('/newElection', (req, res)=>{
  var newElection = new Election();
  newElection.class = req.body.$class;
  newElection.electionId = req.body.electionId;
  newElection.motion = req.body.motion;
  newElection.start = req.body.start;
  newElection.end = req.body.end;
  newElection.candidates = req.body.candidates;
  newElection.admin = req.body.admin;
  newElection.save((err)=>{
    if(err){
      res.status(500).send(err);
      throw err;
    } else {
      res.status(200).send('Successfully saved');
    }
  });
});
router.get('/allVotes', (req, res)=>{
  votes.find((err, doc)=>{
    if(err){
      throw err;
    } else {
      res.status(200).send(doc);
    }
  })
});
router.get('/votes', (req, res, next)=>{
  var election = req.param('election');
  var electionData;
  Election.find({electionId: election }, (err, docr)=>{
    if (err){
      throw err;
    } else {
      electionData = docr;
    }
  });
  votes.find({ election : election }, (err, doc)=>{
    if(err) throw err;
    res.status(200).send(doc);
    console.log(doc);
  });
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
