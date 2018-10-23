const mongoose = require('mongoose');

var sys = require(__dirname + '/../config/System');
var db = mongoose.connect(sys.db_uri, {useMongoClient: true });
mongoose.Promise =require('bluebird');

const Schema = mongoose.Schema;

const userSchema = new Schema({
		username: { type: String, index: { unique: true, sparse: true }},
		names: String,
    facebookid: {type:String},
    googleid: {type:String},
		phone: { type: String, index: { unique: true, sparse: true }},
		password: String,
		role: String,
		email: String,
		otp: String
});

module.exports = mongoose.model('User', userSchema);
