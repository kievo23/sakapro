var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SakaPro' });
});

router.get('/terms-conditions', function(req, res, next){
  res.render('site/terms',{title: 'SakaPro: Terms and Conditions'});
});

module.exports = router;
