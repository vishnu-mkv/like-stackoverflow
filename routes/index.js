var express = require('express');
var router = express.Router();
const Question = require('../models/question');
const Answer = require('../models/answer');
const Profile = require('../models/profile');
const { imageUpload } = require('../upload.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  Question.find({askedBy: req.oidc.user.nickname}, function(err, data) {
    res.render('index', {data});
  })
});

router.get('/ask', function(req, res) {
  res.render('askform');
})

router.post('/ask', function(req, res) {
  Question.create({'question': req.body.question, 'askedBy': req.oidc.user.nickname, 'answered': false, 'answerCount': 0}, function(err, instance) {
    if(err) {
      res.render('error2')
    }
    console.log(instance);
    res.redirect('/question/'+instance._id);
  })
})

router.get('/question/:id', function(req, res) {
  Question.findById(req.params.id, function(err, instance) {
    if(err) {
      res.render('error2');
    }
    Answer.find({questionID: req.params.id}, function(err, answerData) {
      res.render('question_view', {instance, answerData});
    })
  });
})

router.get('/questions', function(req, res) {
  Question.find({}, function(err, data) {
    res.render('question_list', {data});
  })
})

// create answer
router.post('/answer/:id', imageUpload.single('answerFile'), function(req, res) {
  let id = req.params.id
  let ans = req.body.answer, file = false;

  if(req.file) {
    ans = req.file.location;
    file = true 
  }

  Answer.create({questionID: id, answeredBy: req.oidc.user.nickname, answer: ans, file, votes: 0, }, function(err, instance) {
    Question.updateOne({_id: id}, {$inc : {'answerCount' : 1}}, {new: true}, function() {
      res.redirect('/question/'+id+'#'+instance._id);
    })
  })
})

router.post('/answer/:id/review', function(req, res) {
  let id = req.params.id
  Answer.updateOne({_id: id}, {comment: req.body.comment, rating: req.body.rating, rated: true}, function(err, data) {
    Answer.findById(id, (err, instance) => {
      res.redirect('/question/'+instance.questionID);
    })
  })
})

router.post('/question/:id/delete', function(req, res) {
  Question.findById(req.params.id).remove(function(data) {
    res.redirect('/questions/')
  })
})

router.get('/profile', function(req, res) {
  let name = req.oidc.user.nickname;
  Profile.findOneAndUpdate({nickname: name}, 
    {$setOnInsert:{nickname: name, username: name, picture: req.oidc.user.picture}}, 
    { upsert: true }, function(err, data) {
      Profile.findOne({nickname: name}, function(err, profile) {
        res.render('profile', {profile});
      })
    })
});

router.post('/profile/:nickname', imageUpload.single('profileimage'), function(req, res) {
  let username = req.body.username, update = {username};
  if(req.file) {
    update.picture = req.file.location;
  }
  Profile.findOneAndUpdate({nickname: req.params.nickname}, 
    update, {}, function(err, data) {
      res.redirect('/');
    })
})


module.exports = router;
