var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var electionSchema = new Schema({
    faction : {type: String, required: true},
    electionId : {type: String, required: true},
    motion : {type: String, required: true},
    start : {type: Date, required: true},
    end : {type: Date, required: true},
    candidates : [{}],
    admin : {}
});

var Election = mongoose.model('Election', electionSchema);
module.exports = Election;