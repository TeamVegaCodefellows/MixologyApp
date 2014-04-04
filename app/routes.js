var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var User = require('../api/models/User.js')

module.exports = function(app, passport) {
  // ============================
  // home page with login links
  // ============================

  app.get('/', function(req, res) {
    res.render('index'); // load the index.hbs file
  });

  // ============================
  // login
  // ============================
  // show the login form
//  app.get('/login', function(req, res) {
//
//    // render the page and pass in any flash data if it exists
//    res.render('login', {
//      message: req.flash('loginMessage')
//    });
//  });

  // process the login form
//  app.post('/login', passport.authenticate('local-login', {
//    successRedirect : '/', // redirect to the secure profile section
////    failureRedirect : '/signup', // redirect back to the signup page if there is an error
//    failureFlash : true // allow flash messages
//  }), function(req, res) {
//    console.log('email', req.email);
//  });
  app.post('/login', function(req, response){
    console.log(req.body);
    User.findOne({ localEmail : req.body.localEmail }, function(err, user) {
      if (user!==null){
        bcrypt.compare(req.body.localPassword, user.localPassword, function(err, res){
          if (res === true) {
            req.session.loggedIn=true;
            response.send("ok");
          }
          else response.send("fail");
        });
      }
      else {
        response.send("fail");
      }
    });
  });

  app.post('/saveDrink', function(req, response){
    console.log('here');
    console.log(req.body);
//    if (req.session.loggedIn === true){
      User.findOne({localEmail : req.body.localEmail, 'savedDrinks.drink' : req.body.drink} , function(err, res){
        if (res !== null){
          response.send('Duplicate');
        }
        else {
          User.update({localEmail : req.body.localEmail}, {$push: {savedDrinks:{"drink":req.body.drink}}} , function(err, res){
            console.log('saved',res);
            response.send('Saved!');
          });
        }
      });
//    }
  })

  // ============================
  // signup
  // ============================
  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and passs in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if error
    failureFlash : true // allow flash messages
  }));

  // ============================
  // profile section
  // ============================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // ============================
  // logout
  // ============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // ==================
  // Twitter Routes
  // ==================
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));
  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't, redirect them to the home page
  res.redirect('/');
}