var express = require('express');
var router = express.Router();
var Prof = require(__dirname + '/../models/Pro');

/* GET profs listing. */
router.get('/', function(req, res, next) {
  Prof.find({}).populate('jobtype').then(function(d){
    res.render('profs/index',{profs: d});
  });
});

router.get('/approve/:id',function(req, res){
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

module.exports = router;
