var express = require('express');
var router = express.Router();
var Prof = require(__dirname + '/../models/Pro');
var role = require(__dirname + '/../config/Role');

/* GET profs listing. */
router.get('/',role.auth, function(req, res, next) {
  Prof.find({}).populate('jobtype').then(function(d){
    res.render('profs/index',{profs: d});
  });
});

router.get('/approve/:id',role.auth,function(req, res){
  Prof.findById(req.params.id).then(function(prof){
      if(prof.approved == true){
        prof.approved = false;
      }else{
        prof.approved = true;
      }
      prof.save(function(err){
        if(err){
          console.log(err);
          res.redirect('/prof');
        }else{
          res.redirect('/prof');
        }
      });
  });
});

router.get('/view/:id', function(req, res){
  var prof = Prof.findById(req.params.id).populate('jobtype').then(function(prof){
    res.render('profs/view',{prof: prof});
  });
});

router.get('/update/:id', function(req, res){
  var prof = Prof.findById(req.params.id).then(function(prof){
    res.render('prof/update',{prof: prof});
  });
});

router.get('/delete/:id', function(req, res){
  var prof = Prof.findByIdAndRemove(req.params.id, function (err,offer){
    if(err) { throw err; }
    // ...
    res.redirect('/prof');
  });
});

router.post('/edit/:id',function(req, res){
  var prof = Prof.findById(req.params.id).then(function(category){
    prof.name = req.body.name;
    prof.save(function(err){
      if(err) throw console.log(err);
      res.redirect('/category');
    });
  });
});

module.exports = router;
