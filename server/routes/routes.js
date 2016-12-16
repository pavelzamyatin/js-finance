var express     = require('express');
var router      = require('../routes/api');
var passport    = require('../config/passport');

// =========================================================================
// BASIC ROUTE =============================================================
// =========================================================================
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Index page'
  });
});

router.get('/main', isLoggedIn, function(req, res, next) {
  res.render('main', {
    title : 'Main page',
    id    : req.user._id.toString().slice(-5),
    email : req.user.local.email,
    sess  : req.cookies['connect.sid'].toString().slice(-5)
  });
});

// =========================================================================
// LOGIN ROUTES ============================================================
// =========================================================================

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login page',
    message: req.flash('loginMessage')
  });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/main', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =========================================================================
// SIGNUP ROUTES ===========================================================
// =========================================================================
router.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      title: 'Signup page',
      message: req.flash('signupMessage')
    });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/main', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
