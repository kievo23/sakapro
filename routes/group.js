var express = require('express');
var router = express.Router();

var slug = require('slug');
var User = require(__dirname + '/../models/User');
var Prof = require(__dirname + '/../models/Pro');
var Category = require(__dirname + '/../models/Category');
var Group = require(__dirname + '/../models/Group');
var role = require(__dirname + '/../config/Role');

/* GET users listing. */
router.get('/',role.auth, function(req, res, next) {
  Group.find({}).then(function(d){
    res.render('group/index',{groups: d});
  });
});

//  GROUP
router.get('/create',role.auth,function(req, res){
  res.render('group/create');
});

router.get('/edit/:id',role.auth,function(req, res){
  var group = Group.findById(req.params.id);
  Promise.all([group]).then(values => {
    res.render('group/edit',{group: values[0]});
  });
});

router.post('/edit/:id',role.auth,function(req, res){
  var group = Group.findById(req.params.id).then(function(group){
    group.name = req.body.name;
    group.slug = slug(req.body.name);
    group.save(function(err){
      if(err) throw console.log(err);
      res.redirect('/group');
    });
  });
});

router.post('/create',role.auth,function(req, res){
  Group.create({
    name : req.body.name,
    slug : slug(req.body.name)
  },function(err, category){
    if(err){
      console.log(err);
      res.redirect('/group/create');
    }else{
      res.redirect('/group');
    }
  });
});

router.get('/delete/:id',role.auth, function(req, res){
    Group.findByIdAndRemove(req.params.id, (err, todo) => {
    if(err) {
      return next(new Error('Todo was not found!'));
    }
    res.redirect('/group');
  })
});

module.exports = router;
