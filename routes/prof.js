var express = require('express');
var router = express.Router();
var Prof = require(__dirname + '/../models/Pro');

/* GET profs listing. */
router.get('/', function(req, res, next) {
  Prof.find({}).populate('jobtype').then(function(d){
    res.render('profs/index',{profs: d});
  });
});

module.exports = router;
