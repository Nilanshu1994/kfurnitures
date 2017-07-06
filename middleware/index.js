var cart = require("../models/cart"),
    user = require("../models/user");

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
							req.flash("error","Item Already in the cart");
							res.redirect("back");
			                 
							}
						else{
			                 next();
						}
					}
				});

			},

 checkuser: function(req,res,next){
 	             user.find({username : req.body.username},function(err,users){
 	             	if(users.length){
                          req.flash("error","A user with this username is already registered please choose another");
                          res.redirect("back");
 	             	}
 	             	else{
 	             		next();
 	             	}
 	             })

 }			
};