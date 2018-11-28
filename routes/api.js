var express = require('express');
var router = express.Router();

var request = require("request");
var Jimp = require("jimp");
var slug = require('slug');
var multer  = require('multer');
var mime = require('mime');

var User = require(__dirname + '/../models/User');
var Prof = require(__dirname + '/../models/Pro');
var Category = require(__dirname + '/../models/Category');
var Group = require(__dirname + '/../models/Group');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    var fileName = Date.now() + slug(file.originalname) +'.'+ mime.getExtension(file.mimetype);
    cb(null, fileName);
  }
});

var upload = multer({ storage: storage });
var cpUpload = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'profile', maxCount: 1 },
  { name: 'catalog', maxCount: 5 },
  { name: 'gallery', maxCount: 30 }
]);

router.post('/user/create',function(req, res){
  var code = Math.floor((Math.random() * 9000) + 1000);
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "+254"+phone.substr(phone.length - 9);
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
      var options = { method: 'GET',
        url: 'http://infopi.io/text/index.php',
        qs:
         { app: 'ws',
           u: 'Goodlife',
           h: 'a425d383d0af9d75a9ab1db94747e441',
           op: 'pv',
           to: user.phone,
           msg: 'OTP code is: '+ code } };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //console.log(body);
      });
      res.json({code:100, msg: "OTP generated successfully",user: user});
    }
  });
});

router.post('/user/verifyotp',function(req, res){
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "+254"+phone.substr(phone.length - 9);
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
  phone = "+254"+phone.substr(phone.length - 9);
  User.findOne({phone: phone}).then(function(d){
    if(d){
      var code = Math.floor((Math.random() * 9000) + 1000);
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

router.post('/prof/update/:id',cpUpload,function(req, res){
  Prof.findById(req.params.id).then(function(p){
    //console.log(p);
    var gallery = [];
    //console.log(req.files);
    if(req.files['gallery']){
        p.gallery.push(req.files['gallery']);
		}
    if (req.files['photo']){
		  p.photo = req.files['photo'][0].filename;
		}
    p.save(function(err){
      if(err){
        console.log("err");
        res.json({code:101, msg: "error happened"});
      }else{
        if (req.files['photo']){
          Jimp.read("./public/uploads/"+p.photo).then(function (cover) {
            return cover.resize(200, 140)     // resize
               .quality(100)                // set greyscale
               .write("./public/uploads/profs/thumbs/"+p.photo); // save
          }).catch(function (err) {
            console.error(err);
          });
        }
        if(p.gallery){
          p.gallery.forEach(function(gallery) {
              Jimp.read("./public/uploads/profs/"+gallery.filename).then(function (cover) {
                return cover.resize(200, 140)     // resize
                     .quality(100)                 // set JPEG quality
                     .greyscale()                 // set greyscale
                     .write("./public/uploads/profs/thumbs/"+gallery.filename); // save
            }).catch(function (err) {
                console.error(err);
            });
          });
        }
        res.json({code:100, msg: "Changes made",user:p});
      }
    });
  })
});

router.post('/prof/create',cpUpload,function(req, res){
  var code = Math.floor((Math.random() * 9999) + 1000);
  var phone = req.body.phone.replace(/\s+/g, '');
  phone = "+254"+phone.substr(phone.length - 9);

    Prof.create({
      nickname: req.body.nickname,
      names : req.body.names,
      email: req.body.email,
      phone: phone,
      dob: req.body.dob,
      email: req.body.email,
      pin: req.body.pin,
      occupation: req.body.occupation,
      idno: req.body.idno,
      locationname: req.body.locationname,
      jobtype: req.body.jobtype,
      location: {type: "Point", coordinates: [ req.body.longitude, req.body.latitude ] },
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

router.post('/prof/login',function(req, res){
  Prof.find({
    phone: req.body.phone,
    pin: req.body.pin
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

/*
router.post('/nearby', function(req, res){
  var point = { type : "Point", coordinates : [parseFloat(req.body.longitude),parseFloat(req.body.latitude)] };
  Prof.geoNear(point,{ maxDistance : 5000000, spherical : true, distanceMultiplier: 0.001 })
  .then(function(results){
    results = results.map(function(x) {
      var a = new Prof( x.obj );
      a.dis = x.dis;
      return a;
    });
    Prof.populate( results, { path: "jobtype" }, function(err,docs) {
      if (err) throw err;
      res.json({ nearby: docs });
    });
   });
});*/


router.post('/filter/nearby', function(req, res){
  var point = { type : "Point", coordinates : [parseFloat(req.body.longitude),parseFloat(req.body.latitude)] };
  Prof.aggregate([
     {
       $geoNear: {
          near: point,
          distanceField: "dis",
          maxDistance: 500000,
          query: { approved: true },
          //includeLocs: "dist.location",
          distanceMultiplier: 0.001,
          spherical: true
       }
     }
  ]).then(function(results){
    var results = results.filter(function (el) {
      return el.jobtype ==  req.body.jobtype;
    });
    Prof.populate( results, { path: "jobtype" }, function(err,docs) {
      if (err) throw err;
      res.json({ nearby: docs });
    });
  });
});


router.post('/nearby', function(req, res){
  var point = { type : "Point", coordinates : [parseFloat(req.body.longitude),parseFloat(req.body.latitude)] };
  Prof.aggregate([
     {
       $geoNear: {
          near: point,
          distanceField: "dis",
          maxDistance: 500000,
          //query: { type: "public" },
          query: { approved: true },
          //includeLocs: "dist.location",
          distanceMultiplier: 0.001,
          spherical : true
       }
     }
  ]).then(function(results){
    Prof.populate( results, { path: "jobtype" }, function(err, docs) {
      if (err) throw err;
      res.json({ nearby: docs });
    });
  });
});

router.get('/prof/categories', function(req, res){
  Category.find({}).populate('group').then(function(d){
    res.json({categories: d});
  })
});

router.get('/prof/groups', async(req, res) => {
  var groups = Group.find({});
  var categories = Category.find({});
  Promise.all([groups, categories]).then(values => {
    //console.log(values[0]);
    for (var i = 0; i < values[0].length; i++) {
      for (var j = 0; j < values[1].length; j++) {
        if(values[0][i].id == values[1][j].group){
          values[0][i].children.push(values[1][j]);
        }
      }
    }
    console.log(values[0]);
    res.json({groups: values[0]});
  });

});

module.exports = router;
