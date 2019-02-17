const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const connection = require('../config/dbconn');
const data = require('./data');


// Initial Route to Login Page
router.get('/', (req, res) => res.render('login'));


// Home Page Route where all objects
router.get('/home', ensureAuthenticated, (req, res) => {
  res.render('index',{all_data : data});
});

// Render 3D Object using A-Frame Route
router.get('/render', ensureAuthenticated, (req, res) => {
  res.render('objectrender',{name: req.query.name});
});


// Manual Login/Signup Route
router.post('/login', (req, res, next) => {
  // console.log(req.body.username + req.body.password + req.body.email);
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});


// Facebook Login/Signup Route
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', (req, res, next) => {
  console.log("$$$$$$$$$$$$$$$$$$$");
  console.log(req.user);

  if(!req.user){
    passport.authenticate('facebook', {
      successRedirect: '/account',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next)
  }
  else{
    passport.authenticate('facebookupdate', {
      failureRedirect: '/account',
      failureFlash: true
    })(req, res, next)
  }
});


// Google Login/Signup Route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/auth/google/callback', (req, res, next) => {
  console.log("$$$$$$$$$$$$$$$$$$$");
  console.log(req.user);

  if(!req.user)
  {
    passport.authenticate('google', {
      successRedirect: '/account',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next)
  }
  else{
    passport.authenticate('googleupdate', {
      failureRedirect: '/account',
      failureFlash: true
    })(req, res, next)
  }
});


// Account Page Route
router.get('/account', ensureAuthenticated, (req, res) => res.render('account',{
    user : req.user
  }));


// Getting Update Requests from Account Page Route
router.post('/accountupdate', (req, res) => {
  console.log("############################"+req.user.id);

  if(req.body.name){
    var updateQuery = "update users set name='"+req.body.name+"' where id='"+req.user.id+"';";
  }

  else if(req.body.username){
    var updateQuery = "update users set username='"+req.body.username+"' where id='"+req.user.id+"';";
  }

  else if(req.body.email){
    var updateQuery = "update users set email='"+req.body.email+"' where id='"+req.user.id+"';";
  }

  else if(req.body.password){
    var updateQuery = "update users set password='"+req.body.password+"' where id='"+req.user.id+"';";
  }

  else if(req.body.disconnectgoogle){
    var updateQuery = "update users set googleid = NULL where id='"+req.user.id+"';";
  }

  else if(req.body.disconnectfacebook){
    var updateQuery = "update users set facebookid = NULL where id='"+req.user.id+"';";
  }

    connection.query(updateQuery,function(err,rows){
    if (err)
    {
      console.log("ERROR: NOT UPDATED");
      console.log(err);
    }
    // req.flash('info', 'PASSWORD SUCCESSFULLY CHANGED');
    res.redirect('/account');
    });
});


// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  // req.flash('logged', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
