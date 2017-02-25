// modules required for the project
let express = require('express');
let path = require('path'); // part of node.js core
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
/*
let session = require('express-session'); //Add AUTH
let passportLocal = require('passport-local');
let LocalStrategy = passportLocal.Strategy;
*/

// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
/*
// import flash to display login errors / messages
let flash = require('connect-flash');

// import passport for authentication
let passport = require('passport');
*/
// URI
let config = require('./config/db');

mongoose.connect(process.env.URI || config.URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Conneced to MongoDB...");
});

// define routers
let index = require('./routes/index'); // top level routes
let books = require('./routes/books'); // routes for books

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
/*
//Add AUTH~~~~~~~~
// setup session
app.use(session({
  secret: 'SomeSecret',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
*/
// route redirects
app.use('/', index);
app.use('/books', books);
/*
//Add AUTH
// passport config
let userModel = require('./models/user');
let User = userModel.User;

passport.use(User.createStrategy());
//passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

*/
// Handle 404 Errors
  app.use(function(req, res) {
      res.status(400);
     res.render('errors/404',{
      title: '404: File Not Found'
    });
  });

  // Handle 500 Errors
  app.use(function(error, req, res, next) {
      res.status(500);
      res.render('errors/500', {
        title:'500: Internal Server Error',
        error: error
      });
  });

module.exports = app;
