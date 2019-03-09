var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    name: { type: String, required: true},
    id: {type:String, required: true}, 
    email: {type:String, required: true},
    nationality: {type:String, required: true},
    gender : {type: String, required: true},
    dob: {type: Date, required: true},
    county: {type: String, required: true},
    phoneNo: {type: String, required: true},
    dp: {type: String, required: true},
    institution: {type: String, required: true},
    approved: {type: Boolean,  required: true}
  });

var Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;