var mongoose= require("mongoose");

var furschema = new mongoose.Schema({
	category: String,
	file : String,
	details: String,
	price : String,
	ctime : String
});

module.exports = mongoose.model("fur", furschema);