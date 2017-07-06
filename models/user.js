var mongoose= require("mongoose"),
    passportlocalmongoose= require("passport-local-mongoose");


var userschema = new mongoose.Schema({
	username: String,
	address : String,
	password : String
});

userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model("user" , userschema);
