var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
  author    : { type: String, required: true},
  date      : { type: Date, required: true},
  sum       : { type: Number, required: true},
  category  : { type: Array, required: true},
  comment   : { type: String }
});

module.exports = mongoose.model('entries', entrySchema);
