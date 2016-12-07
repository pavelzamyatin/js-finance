var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

router.get('/', function(req, res, next) {
  // res.send('Hello, World!');
  res.render('index', {
    title: 'Index page'
  });
});

// *** api routes *** //
router.get('/api/entries', findAllEntries);
router.get('/api/entry/:id', findEntryById);
router.post('/api/entries', addEntry);
router.put('/api/entry/:id', updateEntry);
router.delete('/api/entry/:id', deleteEntry);


// *** get ALL Entries *** //
function findAllEntries(req, res) {
  Entry.find(function(err, entries) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(entries);
    }
  });
}

// *** get SINGLE Entries *** //
function findEntryById(req, res) {
  Entry.findById(req.params.id, function(err, entry) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json(entry);
    }
  });
}

// *** post Entry *** //
function addEntry(req, res) {

  var newEntry = new Entry({
    user      : req.body.user,
    date      : req.body.date,
    sum       : req.body.sum,
    category  : req.body.category,
    comment   : req.body.comment
  });

  newEntry.save(function(err) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json({'SUCCESS': newEntry});
    }
  });
}

// *** put SINGLE Entry *** //
function updateEntry(req, res) {
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
}

function deleteEntry(req, res) {
  Entry.findByIdAndRemove(req.params.id, function (err, entry) {
    if(err) {
      res.json({'ERROR': err});
    } else {
      res.json({'REMOVED': entry});
    }
  });
}

module.exports = router;
