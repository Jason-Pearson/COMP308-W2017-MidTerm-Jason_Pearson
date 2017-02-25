// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport'); //Adding the Authentication

// define the game model
let book = require('../models/books');
let User = userModel.User; //Adding the Authentication

//Adding the Authentication
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: '',
    displayName: req.user ? req.user.displayName : ''
   });
});
//Adding the Authentication~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    games: '',
    displayName: req.user ? req.user.displayName : ''
   });
});

// Authentication Section

// GET /register - register page
router.get('/register', (req, res, next) => {
  if(!req.user) {
     res.render('auth/register', {
      title: 'Register',
      games: '',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
     });
  }
});

// POST /register - process the registration page
router.post('/register', (req, res, next) => {
    // attempt to register user
    User.register(
      new User(
       { username: req.body.username,
         password: req.body.password,
         email: req.body.email,
         displayName: req.body.displayName
       })
       , req.body.password, (err) => {
           if(err) {
               console.log('Error Inserting New Data');
               if(err.name == 'UserExistsError') {
               req.flash('registerMessage', 'Registration Error: User Already Exists!');
               }
               return res.render('auth/register', {
                    title: 'Register',
                    games: '',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
           }
           // if registration is successful
           return passport.authenticate('local')(req, res, ()=>{
              res.redirect('/games');
           });
       });
});

// GET /login - render the login page
router.get('/login', (req, res, next) => {
  if(!req.user) {
    res.render('auth/login', {
      title: 'Login',
      games: '',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/games'); // redirect to homepage
  }
});

// POST /login - process the login page
router.post('/login', passport.authenticate('local', {
    successRedirect: '/games',
    failureRedirect: '/login',
    failureFlash: true
}));

// GET /logout - logout the user and redirect to the home page
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
