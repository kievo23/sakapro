var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../models/User');
var Prof = require(__dirname + '/../models/Pro');
var Category = require(__dirname + '/../models/Category');

router.post('/user/create',function(req, res){
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

router.post('/user/verifyotp',function(req, res){
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

router.post('/user/generate',function(){
  User.findOne({phone: req.body.phone}).then(function(d){
    if(d){
      var code = Math.floor((Math.random() * 9999) + 1000);
      d.otp = code;
      d.save(function(err){
        if(err){
          res.json(code:101, msg: "something went wrong");
        }else{
          res.json(code:101, msg: "OTP generated successfully");
        }
      })
    }else{
      res.json({code:101, msg: "User not found"});
    }
  });
});

router.post('/prof/create',function(req, res){
  var code = Math.floor((Math.random() * 9999) + 1000);
  Prof.create({
    nickname: req.body.nickname,
    names : req.body.names,
    email: req.body.email,
    phone: req.body.phone,
    dob: req.body.dob,
    email: req.body.email,
    pin: req.body.pin,
    idno: req.body.idno,
    jobtype: req.body.jobtype,
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

router.post('/prof/verifyotp',function(req, res){
  Prof.find({
    phone: req.body.phone,
    otp: req.body.otp
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      if(user){
        res.json({code: 100, data: user});
      }else{
        res.json({code: 101, msg: "User not found"});
      }
    }
  });
});

router.get('/category', function(req, res){
  Category.find({}).then(function(d){
    res.json(d);
  })
})

module.exports = router;
