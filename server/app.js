// *** main dependencies *** //
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose = require('mongoose');

// *** routes *** //
var routes = require('./routes/routes.js');

// *** config file *** //
var config = require('./_config');

// *** express instance *** //
var app = express();

// *** mongoose *** ///
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

// *** config middleware *** //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../assets')));

// *** main routes *** //
app.use('/', routes);

// *** server config *** //
var server   = http.createServer(app);
server.listen(config.portNumber, function() {
  console.log(`Node server running on http://localhost:${config.portNumber}`);
});

module.exports = app;
