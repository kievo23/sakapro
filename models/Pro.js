const mongoose = require('mongoose');

var sys = require(__dirname + '/../config/System');
var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;

const profSchema = new Schema({
		nickname: { type: String},
		names: String,
		phone: { type: String, index: { unique: true, sparse: true }},
		password: String,
		role: String,
		email: { type: String, index: { unique: true, sparse: true }},
    pin: String,
    dob: String,
    idno: { type: String, index: { unique: true, sparse: true }},
    jobtype: { type: Schema.Types.ObjectId, ref: 'Category' },
		otp: String
});

module.exports = mongoose.model('Prof', profSchema);