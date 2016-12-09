var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
  user    : { type: String, required: true},
  date      : { type: Date, required: true},
  sum       : { type: Number, required: true},
  category  : { type: String, required: true},
  comment   : { type: String }
});

module.exports = mongoose.model('entries', entrySchema);
