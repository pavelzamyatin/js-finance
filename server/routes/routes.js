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
// router.get('/Entry/:id', findEntryById);
router.post('/api/entries', addEntry);
// router.put('/Entry/:id', updateEntry);
// router.delete('/Entry/:id', deleteEntry);


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

// // *** get SINGLE Entries *** //
// function findEntryById(req, res) {
//   Entry.findById(req.params.id, function(err, Entry) {
//     if(err) {
//       res.json({'ERROR': err});
//     } else {
//       res.json(Entry);
//     }
//   });
// }

// *** post Entry *** //
function addEntry(req, res) {

  var newEntry = new Entry({
    user      : req.body.user,
    date      : new Date(),
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
//
// // *** put SINGLE Entry *** //
// function updateEntry(req, res) {
//   Entry.findById(req.params.id, function(err, Entry) {
//     Entry.name = req.body.name;
//     Entry.lastName = req.body.lastName;
//     Entry.save(function(err) {
//       if(err) {
//         res.json({'ERROR': err});
//       } else {
//         res.json({'UPDATED': Entry});
//       }
//     });
//   });
// }
//
// // *** delete SINGLE Entry *** //
// function deleteEntry(req, res) {
//   Entry.findById(req.params.id, function(err, Entry) {
//     if(err) {
//       res.json({'ERROR': err});
//     } else {
//       Entry.remove(function(err){
//         if(err) {
//           res.json({'ERROR': err});
//         } else {
//           res.json({'REMOVED': Entry});
//         }
//       });
//     }
//   });
// }

module.exports = router;
