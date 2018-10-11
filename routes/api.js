var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../models/User');

router.post('/create',function(req, res){
  var code = Math.floor((Math.random() * 9999) + 1000);
  User.create({
    names : req.body.names,
    email: req.body.email,
    phone: req.body.phone,
    facebookid: req.body.facebookid,
    googleid: req.body.googleid,
    otp: code
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      res.json({code: 100, user: user});
    }
  });
});

router.post('/verifyotp',function(req, res){
  User.find({
    phone: req.body.phone,
    otp: req.body.otp
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      res.json({code: 100, user: user});
    }
  });
});

module.exports = router;
