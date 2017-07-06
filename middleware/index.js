var cart = require("../models/cart");

module.exports = {
 isLoggedin:  function(req, res, next){
		    	if(req.isAuthenticated()){
		    		return next();
		    	}
		    	req.flash("error", "You Have to be Logged In To Access this");
		    	res.redirect("/register");
		    },


privilage: function(req , res , next)
			{
				if(req.isAuthenticated())
				{
					if((req.user.username) === ("admin"))
					{
			             next();
					}
					else
					{
						req.flash("error" , "Admin Privilage required");
						res.redirect("/");
					}
				}
				else{
					    req.flash( "error" ,"You Need to login first");
						res.redirect("/register");
				}
			},


dbcheck: function(req,res,next){
				cart.find({furid:req.body.fid,userid:req.user._id}, function(err,carts){
					if(err){
						console.log(err);
					}
					else{
						if(carts.length){
							console.log("notadded");
							res.send("notadded");
			                 
							}
						else{
			                 next();
						}
					}
				});

			}
};