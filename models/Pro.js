const mongoose = require('mongoose');

var sys = require(__dirname + '/../config/System');
var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;

const profSchema = new Schema({
		nickname: { type: String, index: { unique: true, sparse: true }},
		names: String,
		phone: String,
		password: String,
		role: String,
		email: String,
    pin: String,
    dob: String,
    idno: String,
    jobtype: { type: Schema.Types.ObjectId, ref: 'Category' },
		otp: String
});

module.exports = mongoose.model('Prof', profSchema);
