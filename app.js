require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Admin = require('./models/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.moment = require('moment');

const { auth } = require('express-openid-connect');
const Profile = require('./models/profile');


app.get('/userlogout', function(req, res) {
  delete req.oidc;
  res.render('logout')
})

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CID,
  issuerBaseURL: process.env.ISSUER
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use((req, res, next) => {

  if(!req.oidc.user) {

      // render the error page
      res.redirect('/login');
  }else {
      res.locals.user = req.oidc.user;
      Admin.find({email: req.oidc.user.email}, function(err, data) {
        if(data.length !== 0) {
          res.locals.isAdmin = true;
        } 
        Profile.findOne({nickname: req.oidc.user.nickname}, function(err, data) {
          if(data) {
            res.locals.profileName = data.username;
            res.locals.profilePicture = data.picture;
          }else {
            res.locals.profileName = req.oidc.user.nickname;
            res.locals.profilePicture = req.oidc.user.picture;
          }
          next(); 
        })
      })
  }

});


app.use('/', indexRouter);
app.use('/users', usersRouter);

const uri = `mongodb+srv://mkv:${process.env.DB_PASSWORD}@cluster0.9kf4f.mongodb.net/tutor?retryWrites=true&w=majority`;
mongoose.connect(uri)
.then(_ => {
    console.log("connected to db"); 
})

if(process.env.NODE_ENV !== "production") {

  var livereload = require("livereload");
  var connectLiveReload = require("connect-livereload");
  
  // live reload browser
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'public'));
  
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 1000);
  });
  
  app.use(connectLiveReload());
}


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
