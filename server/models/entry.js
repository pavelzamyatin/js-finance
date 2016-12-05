var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new Schema({
  name: String,
});


module.exports = mongoose.model('entries', entrySchema);
