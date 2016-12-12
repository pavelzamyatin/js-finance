var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');
var validator = require('validator');

router.get('/', function(req, res, next) {
  // res.send('Hello, World!');
  res.render('index', {
    title: 'Index page'
  });
});

// *** get ALL Entries *** //
router.get('/api/entries', function findAllEntries(req, res) {
  Entry.find({}, function(err, entries) {
    if(err) {
      res.json({
          "STATUS": "ERROR",
          "ERROR": err,
          "ITEMS": []
      });
    } else {
      res.json({
          "STATUS": "SUCCESS",
          "ERROR": "",
          "ITEMS": entries
      });
    }
  });
});


// *** get SINGLE Entries *** //
router.get('/api/entry/:id', function findEntryById(req, res) {
  Entry.findById(req.params.id, function(err, entry) {
    if(err) {
      res.json({
          "STATUS": "ERROR",
          "ERROR": err,
          "ITEMS": []
      });
    } else {
      res.json({
          "STATUS": "SUCCESS",
          "ERROR": "",
          "ITEMS": [entry]
      });
    }
  });
});


// *** post Entry *** //
router.post('/api/entries', function addEntry(req, res) {

  var newEntry = new Entry({
    user      : req.body.user,
    date      : validator.toDate(req.body.date),
    sum       : validator.toFloat(req.body.sum.toString()),
    category  : validator.escape(req.body.category),
    comment   : validator.escape(req.body.comment)
  });

  newEntry.save(function(err) {
    if(err) {
      res.json({
          "STATUS": "ERROR",
          "ERROR": err,
          "ITEMS": [newEntry]
      });
    } else {
      res.json({
          "STATUS": "SUCCESS",
          "ERROR": "",
          "ITEMS": [newEntry]
      });
    }
  });
});

// *** put SINGLE Entry *** //
router.put('/api/entry/:id', function updateEntry(req, res) {
  Entry.findById(req.params.id, function(err, entry) {
    Entry.name = req.body.sum;
    Entry.save(function(err) {
      if(err) {
        res.json({'ERROR': err});
      } else {
        res.json({'UPDATED': entry});
      }
    });
  });
});

// *** delete single Entry *** //
router.delete('/api/entry/:id', function deleteEntry(req, res) {
  Entry.findByIdAndRemove(req.params.id, function (err, entry) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json({'REMOVED': entry});
    }
  });
});

module.exports = router;
