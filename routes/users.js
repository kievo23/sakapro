var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}).then(function(d){
    res.render('users/index',{users: d});
  });
});

router.get('/create',function(req, res){
  res.render('users/create');
});

router.post('/create',function(req, res){

  var code = Math.floor((Math.random() * 9999) + 1000);
  User.create({
    names : req.body.names,
    email: req.body.email,
    phone: req.body.phone,
    otp: code
  },function(err, user){
    if(err){
      console.log(err);
      res.redirect('/users/create');
    }else{
      res.redirect('/users');
    }
  });
});

module.exports = router;
