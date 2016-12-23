var express     = require('express');
var router      = express.Router();
var validator   = require('validator');
var Entry       = require('../models/entry');

// *** protect from CSRF *** ///
var csrf            = require('csurf');
var csrfProtection  = csrf({ cookie: true })

// =========================================================================
// API ROUTES =============================================================
// =========================================================================

// *** get ALL Entries plus FILTERED Entries ***
router.get('/api/entries', function(req, res) {
  // create new instance of Entry model
  var newEntry = Entry.find({})

  // checking filters
  if(req.query.category) {
    newEntry.where('category').equals(req.query.category);
  }

  // response generator
  newEntry.exec(function(err, entries) {
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
router.get('/api/entry/:id', function(req, res) {
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
router.post('/api/entries', csrfProtection, function(req, res) {

  var newEntry = new Entry({
    user      : req.body.user,
    date      : validator.toDate(req.body.date),
    sum       : validator.toFloat(req.body.sum.toString()),
    category  : validator.escape(req.body.category),
    comment   : validator.escape(req.body.comment)
  });

  newEntry.save(function(err) {
    if (err) {
      res.json({
          "STATUS": "ERROR",
          "ERROR": err,
          "ITEMS": []
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
router.put('/api/entry/:id', function(req, res) {
  Entry.findById(req.params.id, function(err, entry) {

    if (req.body.date) { entry.date = validator.toDate(req.body.date); }
    if (req.body.sum) { entry.sum = validator.toFloat(req.body.sum.toString()); }
    if (req.body.category) { entry.category = validator.escape(req.body.category); }
    if (req.body.comment) { entry.comment = validator.escape(req.body.comment); }

    entry.save(function(err) {
      if (err) {
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
});

// *** delete single Entry *** //
router.delete('/api/entry/:id', function(req, res) {
  Entry.findByIdAndRemove(req.params.id, function (err, entry) {
    if (err) {
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

module.exports = router;
