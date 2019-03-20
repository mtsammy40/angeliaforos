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
var upload = multer({ dest: 'uploads/' });
var queries = require('../components/queries');
var charts = require('../components/charts');
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
  var mailed = mail.mailTo(dest, subject, text, attachments, res);
  if(mailed){
    res.status(200).send('mail sent to ' + dest);
  } else {
    res.status(500).send('Failed to send email to : ' + dest);
  }
  setTimeout(()=>{console.log('mail message after 2s',mail)}, 2000);
});


router.post('/sendVoterEmail', upload.single('data'), (req, res)=>{
  var tempPath = req.file.path;
  console.log('path file', tempPath);
  var name = req.body.id;
  var dest = req.body.email;
  console.log('dest', req.body.email);
  var subject = "You have been Registered as a voter!";
  var text = "Find attached your identity. Download it and upload it when promted! Keep it secret!!!";
  var attachments= [
    {   // utf-8 string as an attachment
      filename: name+'.card',
      path: tempPath
    },
  ];
  var mailed = mail.mailTo(dest, subject, text, attachments, res);
  if(mailed){
    res.status(200).send('mail sent to ' + dest);
  } else {
    res.status(500).send('Failed to send email to : ' + dest);
  }
  setTimeout(()=>{console.log('mail message after 2s',mail)}, 2000);
});


router.post('/sendRegEmail', upload.single('data'), (req, res)=>{
  var tempPath = req.file.path;
  console.log('path file', tempPath);
  var name = req.body.id;
  var dest = req.body.email;
  console.log('dest', req.body.email);
  var subject = "You have been Registered as a Regulator!";
  var text = "Find attached your identity. Download it and upload it when promted! Keep it secret!!!";
  var attachments= [
    {   // utf-8 string as an attachment
      filename: name+'.card',
      path: tempPath
    },
  ];
  var mailed = mail.mailTo(dest, subject, text, attachments, res);
  if(mailed){
    res.status(200).send('mail sent to ' + dest);
  } else {
    res.status(500).send('Failed to send email to : ' + dest);
  }
  setTimeout(()=>{console.log('mail message after 2s',mail)}, 2000);
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
  var candidateIds=[]; 
  //Get only the Id of the candidates
  for(var i = 0; i<req.body.candidates.length; i++){
    var candidateId = req.body.candidates[i].split('#').pop();
    candidateIds.push(candidateId);
  }
  newVote.election = req.body.election;
  newVote.candidate = req.body.candidate;
  newVote.gender = req.body.gender;
  newVote.age = req.body.age;
  newVote.candidates = candidateIds;
  newVote.save(err=>{
    if(err){
      throw err;
    } else {
      res.status(200).send('Successfully Saved');
    }
  })
});
router.post('/newElection', (req, res)=>{
  var recepients = req.body.recepients;
  var ballotKeys = req.body.ballotKeys;
  var election = req.body.election;
  var newElection = new Election();
  newElection.faction = "org.bitpoll.net.Election";
  newElection.electionId = election.electionId;
  newElection.motion = election.motion;
  newElection.start = election.start;
  newElection.end = election.end;
  newElection.candidates = election.candidates;
  newElection.admin = election.admin;
  newElection.save((err)=>{
    if(err){
      res.status(500).send(err);
      throw err;
    } else {
      res.status(200).send('Successfully saved');
      mailingList = [];
      for(var i=0; i<recepients.length; i++){
        mail.mailTo(recepients[i], "New Election has been Scheduled!", "Your key is "+ballotKeys[i]);
      }
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

//Get statistics per election
router.get('/votesForElection', (req, res, next)=>{
  var election = req.param('election');
  votes.find({ election : election }, (err, doc)=>{
    if(err) throw err;
    console.log('Votes found', doc);
    if(doc.length > 0){
      var candidates = doc[1].candidates;
      var totalVotes = queries.getTotalVotes(doc, candidates);
      console.log('total votes', totalVotes);
      //render charts
      var mChart = charts.Male(totalVotes);
      var fChart = charts.Female(totalVotes);
      var fullChart = charts.Full(totalVotes);
      console.log('total votes', totalVotes);
      console.log('mChart', fChart);
      var Results = {
        mChart : mChart,
        fChart : fChart,
        fullChart: fullChart, 
        results: totalVotes
      }
      res.status(200).contentType('json').send(Results);
    } else {
      res.status(304).send("Data not found");
    }
  });
  
});

//send email to recepient
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
