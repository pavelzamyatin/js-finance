// *** main dependencies *** //
var express       = require('express');
var path          = require('path');
var bodyParser    = require('body-parser');
var http          = require('http');
var mongoose      = require('mongoose');
var flash         = require('connect-flash');
var favicon       = require('serve-favicon');

// *** auth dependencies *** //
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

// *** routes *** //
var routes        = require('./routes/routes.js');

// *** config file *** //
var config        = require('./config/config');

// *** express instance *** //
var app           = express();

// *** mongoose *** ///
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

// *** tell express that we want to use EJS view engine *** //
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// *** required for passport *** //
app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({ secret: 'ilovemoney' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// *** config middleware *** //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(favicon(path.join(__dirname, 'assets', 'img/favicon.png')));

// *** main routes *** //
app.use('/', routes);

// *** server config *** //
var server   = http.createServer(app);
server.listen(config.portNumber, function() {
  console.log(`Node server running on http://localhost:${config.portNumber}`);
});

module.exports = app;
