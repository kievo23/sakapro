var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var cookieSession = require('cookie-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var catRouter = require('./routes/category');
var profRouter = require('./routes/prof');
var groupRouter = require('./routes/group');

const User = require('./models/User');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieSession({
  name: 'session',
  keys: ['m@ckl3mor3!sth#b0mb'],

  // Cookie Options
  //maxAge: 7 * 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user){
    //done(null, {id: "1",username: "sakapro",password: "$2y$10$ZrutfEDj.84ey3jgnSEsz.N25DnNKKwRg60CR9oDU5o2vsY6119rG"});
    done(null, user);
  });
});


passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {

    User.findOne({ 'email':username }).then(function(user){
      console.log(user);
      //console.log(password);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(function(err){
      console.log(err);
    });
  }
));

// MIDDLEWARE
app.use(function( req, res, next) {
  var loggedin = false;
  // set locals, only providing error in development
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.msgerror = req.flash('error') || null;
  res.locals.msgdefault = req.flash('default') || null;
  res.locals.msgsuccess = req.flash('success') || null;
  res.locals.msgprimary = req.flash('primary') || null;
  res.locals.msginfo = req.flash('info') || null;
  res.locals.msgwarning = req.flash('warning') || null;
  //console.log(res.locals.error);
  if(req.user){
    loggedin = true;
      res.locals.user = req.user || {};
      res.locals.loggedin = loggedin;
  }else{
    //res.locals.message = err.message;
    res.locals.user = req.user || {};
    res.locals.loggedin = loggedin;
  }
  next();
});





app.post('/login', passport.authenticate('local', {failureRedirect: '/login',
                                   failureFlash: true })
  , function(req, res){
    //console.log(res);
    ssn = req.session;
    if(ssn.returnUrl){
      res.redirect(ssn.returnUrl);
    }
    res.redirect('/');
});

app.get('/login', function(req, res){
  res.render('users/login', {title: "Sign Up"});
});

app.get('/logout', function(req, res){
  req.logout();
  req.session = null;
  res.redirect("/login");
  res.end();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/category', catRouter);
app.use('/prof', profRouter);
app.use('/group', groupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
