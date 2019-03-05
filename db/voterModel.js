var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voterSchema = new Schema({
    name: { type: String, required: true},
    id: {type:String, required: true}, 
    dp: {type: String, required: true}
  });

var Voter = mongoose.model('Voter', voterSchema);
module.exports = Voter