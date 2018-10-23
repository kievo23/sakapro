var express = require('express');
var router = express.Router();

var request = require("request");

var User = require(__dirname + '/../models/User');
var Prof = require(__dirname + '/../models/Pro');
var Category = require(__dirname + '/../models/Category');

router.post('/user/create',function(req, res){
  var code = Math.floor((Math.random() * 9999) + 1000);
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "254"+phone.substr(phone.length - 9);
  User.create({
    names : req.body.names,
    email: req.body.email,
    phone: phone,
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
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "254"+phone.substr(phone.length - 9);
  User.findOne({
    phone: phone,
    otp: req.body.otp
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      if(user){
        res.json({code: 100, msg: "User Found", user: user});
      }else{
        res.json({code: 101, msg: "User Not Found", user: user});
      }
    }
  });
});

router.post('/user/generateotp',function(req, res){
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "254"+phone.substr(phone.length - 9);
  User.findOne({phone: phone}).then(function(d){
    if(d){
      var code = Math.floor((Math.random() * 9999) + 1000);
      d.otp = code;
      d.save(function(err){
        if(err){
          res.json({code:101, msg: "something went wrong"});
        }else{
          var options = { method: 'GET',
            url: 'http://infopi.io/text/index.php',
            qs:
             { app: 'ws',
               u: 'Goodlife',
               h: 'a425d383d0af9d75a9ab1db94747e441',
               op: 'pv',
               to: d.phone,
               msg: 'OTP code is: '+ code },
            headers:
             { 'postman-token': '4ca47976-a3bc-69d6-0cae-e80049f926e9',
               'cache-control': 'no-cache' } };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            res.json({code:100, msg: "OTP generated successfully"});
            //console.log(body);
          });

        }
      })
    }else{
      res.json({code:101, msg: "User not found"});
    }
  });
});

router.post('/prof/create',function(req, res){
  var code = Math.floor((Math.random() * 9999) + 1000);
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "254"+phone.substr(phone.length - 9);
  Prof.create({
    nickname: req.body.nickname,
    names : req.body.names,
    email: req.body.email,
    phone: phone,
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

//SOCIALS
router.post('/user/verifyfb',function(req, res){
  User.findOne({
    facebookid: req.body.facebookid
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      if(user){
        res.json({code: 100, msg: "User Found", user: user});
      }else{
        res.json({code: 101, msg: "User Not Found", user: user});
      }
    }
  });
});

router.post('/user/verifyg',function(req, res){
  User.findOne({
    googleid: req.body.googleid
  },function(err, user){
    if(err){
      console.log(err);
      res.json({code: 101, err: err});
    }else{
      if(user){
        res.json({code: 100, msg: "User Found", user: user});
      }else{
        res.json({code: 101, msg: "User Not Found", user: user});
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
