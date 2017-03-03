// *** main dependencies *** //
var path            = require('path');
var formidable      = require('formidable');
var fs              = require('fs');

var config          = require('../config/config');

// *** routes *** //
var router          = require('../routes/api');

// *** protect from CSRF *** ///
var csrf            = require('csurf');
var csrfProtection  = csrf({ cookie: true })

// =========================================================================
// UPLOAD ROUTES ===========================================================
// =========================================================================
router.get('/upload', isLoggedIn, csrfProtection, function(req, res, next) {
  res.render('upload', {
    sitename  : config.siteName,
    title     : 'Upload page',
    id        : req.user._id,
    email     : req.user.local.email,
    sess      : req.cookies['connect.sid'],
    csrfToken : req.csrfToken()
  });
});

router.post('/upload', csrfProtection, function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  
  //to keep the extensions of the file
  form.keepExtensions = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  // form.on('file', function(field, file) {
  //   fs.rename(file.path, path.join(form.uploadDir, file.name));
  // });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

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
