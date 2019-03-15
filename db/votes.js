var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var votesSchema = new Schema({
    election: { type: String, required: true},
    candidate: {type:String, required: true}, 
    gender: {type:String, required: true},
    age: {type:String, required: true},
    timestamp : {type: Date, default: Date.now},
    candNo : {type: Number, required: true }
  });

var votes = mongoose.model('votes', votesSchema);
module.exports = votes;