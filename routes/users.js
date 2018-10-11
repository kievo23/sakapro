var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}).then(function(d){
    res.send('users/index',{users: d});
  });
});

router.get('/create',function(req, res){
  res.send('users/create');
});

router.post('/create',function(req, res){
  res.send('users/create');
});

module.exports = router;
