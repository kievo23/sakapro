var express = require('express');
var router = express.Router();

var slug = require('slug');
var User = require(__dirname + '/../models/User');
var Prof = require(__dirname + '/../models/Pro');
var Category = require(__dirname + '/../models/Category');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Category.find({}).then(function(d){
    res.render('category/index',{categories: d});
  });
});

router.get('/create',function(req, res){
  res.render('category/create');
});

router.post('/create',function(req, res){
  Category.create({
    name : req.body.name,
    slug : slug(req.body.name)
  },function(err, category){
    if(err){
      console.log(err);
      res.redirect('/category/create');
    }else{
      res.redirect('/category');
    }
  });
});

module.exports = router;
