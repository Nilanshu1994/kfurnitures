var mongoose= require("mongoose");


var cartschema = new mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId,
         ref: "user"
         },
    furid: {type: mongoose.Schema.Types.ObjectId,
         ref: "fur"
     },
     username: String
});


module.exports = mongoose.model("cart" , cartschema);