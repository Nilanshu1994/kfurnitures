var express        = require("express"),
    app            = express(),
    mongoose       = require("mongoose"),    
    expresssession = require("express-session"),
	bodyparser     = require("body-parser"),
	flash          = require("connect-flash"),
    ejs            = require("ejs"),
    methodoverride = require("method-override"),
    passport       = require("passport"),
    passportlocal  = require("passport-local"),
    passportlocalmongoose=require("passport-local-mongoose");
    


app.use(expresssession({
	secret: "i love sleeping in a comfortable bed",
	resave: false,
	saveUninitialized: false
}))


  //=======================================
 //      Schema
// ======================================

var fur = require("./models/furniture");
var user = require("./models/user");
var cart = require("./models/cart");
//=======================================     

//======================================
//           Middleware Initialize
//======================================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(user.authenticate()));
// used for session encoding and decoding data
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(flash());


app.use( function(req , res , next){
	res.locals.currentuser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");

	next();
});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect(process.env.DATABASEURL);
app.use(methodoverride("_method"));

var middleware = require("./middleware");
//=========================================================
// Routes
//=========================================================

app.get("/",function(req,res){
	res.render("landing");
})

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.get("/upload",middleware.privilage ,function(req,res){
	res.render("upload");
})

app.get("/register",function(req,res){
	res.render("register");
})

 app.post("/carts",middleware.checkusernames,function(req,res){
 	cart.find({username: req.body.search}).populate("furid").exec(function(err,carts){
		if(err){
			console.log(err);
		}
		else{ 
			res.render("cart",{carts:carts, uname: req.body.search});
		     }
}) 

 });

app.post("/register",middleware.checkuser,function(req,res){
	user.register(new user({username: req.body.username , address: req.body.address}), req.body.password, function(err , user){
		if(err)
		{
			console.log(err);
		    return res.render("register");
		}
		else{
              passport.authenticate("local")(req,res,function(){
              	req.flash("success","Registered Successfully");
              	res.redirect("/");
              })
		}
	})

})

app.post("/login", passport.authenticate("local", {
	                 successRedirect: "/",              // IMPORTANT
	                 failureRedirect: "/register"
	                 }) ,function(req,res){
})

app.get("/edit/:id", middleware.privilage , function(req, res){
	fur.findById(req.params.id , function(err,furn){
       if(err)
       {
       	console.log(err);
       }
       else{
       	res.render("edit" , {furn : furn});
       }
	})
     
})

app.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/")
})

app.get("/cart",middleware.isLoggedin,function(req,res){
	cart.find({userid : req.user._id}).populate("furid").exec(function(err,carts){
		if(err){
			console.log(err);
		}
		else{
			    res.render("cart",{carts:carts});
		     }
}) 
});

app.post("/addcart",middleware.isLoggedin,middleware.dbcheck,function(req,res){
              cart.create({
					furid: req.body.fid,
					userid: req.user._id,
					username : req.user.username       	
			         },function(err,carts){
			         	if(err){
			         		console.log(err);                            
			         	}
			         	else{ 
			         		req.flash("success","Successfully added item to cart");
                            res.redirect("back");
			         	}
			         });
});

app.delete("/cart/:id", middleware.isLoggedin , function(req, res){
	cart.findByIdAndRemove(req.params.id, function(err,furn){
		if(err)
		{
			console.log(err);
		}
		else{
			req.flash("success","Item Removed from cart");
			res.redirect("/cart");
		}
	})
})

app.get("/:category" , function(req,res){
	var cat =req.params.category;
    fur.find({category : cat}, function(err, cats){
    	if(err)
    	{
    		console.log(err);
    	}
    	else{
    		res.render("category", {cats : cats, cat : cat});
    	}
    })
})

app.post("/", middleware.privilage , function(req,res){
         fur.create({
         	category: req.body.category,
         	file : req.body.path,
         	details : req.body.details,
         	price : req.body.price,
         	ctime : req.body.ctime
         },function(err,furniture){
         	if(err){
         		console.log(err);
         	}
         	else{
         		req.flash("success","File successfully uploaded");
	            res.redirect("/upload");
         	}
         })
})

app.get("/:category/:id", function(req,res){
	fur.findById(req.params.id, function(err,furn){
    if(err)
    {
       console.log(err);
    }
    else{
       res.render("furniture", {furn: furn});
    }

	});
})

app.put("/:category/:id", middleware.privilage , function(req, res){
	var data = {category: req.body.category, file: req.body.path , details: req.body.details , price: req.body.price , ctime: req.body.ctime};
	fur.findByIdAndUpdate(req.params.id, {$set : data} , function(err,furn){
		if(err){
			console.log(err);
		}
		else{
			req.flash("success","Furniture data successfully updated");
			res.redirect("/"+furn.category+"/"+furn._id)
		}
	});
})

app.delete("/:category/:id", middleware.privilage , function(req, res){
	fur.findByIdAndRemove(req.params.id, function(err,furn){
		if(err)
		{
			console.log(err);
		}
		else{
			req.flash("success","Successfully Removed");
			res.redirect("/" + req.params.category);
		}
	})
})




//=========================================================

app.listen(process.env.PORT, process.env.IP, function(req,res){
	console.log("Server Started");
})