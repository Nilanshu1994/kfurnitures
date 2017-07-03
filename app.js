var express        = require("express"),
    app            = express(),
    mongoose       = require("mongoose"),    
    expresssession = require("express-session"),
	bodyparser     = require("body-parser"),
	//flash          = ("connect-flash"),
    ejs            = require("ejs"),
    multer         = require("multer"),
    storage        = multer.diskStorage({
				    	destination: function(req,file,cb){
				    		cb(null,"images/upload/")
				    	},
				    	filename : function(req,file,cb){
				    	cb(null,file.originalname);
				    }
				    }),
    upload         = multer({storage: storage}),
    methodoverride = require("method-override"),
    passport       = require("passport"),
    passportlocal  = require("passport-local"),
    passportlocalmongoose=require("passport-local-mongoose")


app.use(expresssession({
	secret: "i love sleeping in a comfortable bed",
	resave: false,
	saveUninitialized: false
}))


//=======================================
 //      Schema
// ========================================
 var furschema = new mongoose.Schema({
	category: String,
	file : String,
	details: String,
	price : Number,
	ctime : String,
});

var userschema = new mongoose.Schema({
	username: String,
	address : String,
	password : String,
});

userschema.plugin(passportlocalmongoose);

var fur = mongoose.model("fur", furschema);
var user = mongoose.model("user" , userschema);
     
  //=======================================     



app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(user.authenticate()));
// used for session encoding and decoding data
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use( function(req , res , next){
	res.locals.currentuser = req.user;
	next();
});

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect(process.env.DATABASEURL);
app.use(methodoverride("_method"));


// Routes
//=========================================================

app.get("/",function(req,res){
	res.render("landing");
})

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

app.get("/upload", privilage ,function(req,res){
	res.render("upload");
})

app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req,res){
	user.register(new user({username: req.body.username , address: req.body.address}), req.body.password, function(err , user){
		if(err)
		{
			console.log(err);
		    return res.render("register");
		}
		else{
              passport.authenticate("local")(req,res,function(){
              	res.redirect("/");
              })
		}
	})

})

app.post("/login", passport.authenticate("local", {
	                 successRedirect: "/",
	                 failureRedirect: "/register"
	                 }) ,function(req,res){
})

app.get("/edit/:id", privilage , function(req, res){
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
	res.redirect("/")
})

app.get("/cart",isLoggedin,function(req,res){
	res.render("cart");
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

app.post("/", privilage , upload.single("fileinput"), function(req,res){
         fur.create({
         	category: req.body.category,
         	file : req.file.path,
         	details : req.body.details,
         	price : req.body.price,
         	ctime : req.body.ctime
         },function(err,furniture){
         	if(err){
         		console.log(err);
         	}
         	else{
         		console.log("Furniture data saved");
         	}
         })

	res.render("upload");

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

app.put("/:category/:id", privilage , function(req, res){
	var data = {category: req.body.category, file: req.body.path , details: req.body.details , price: req.body.price , ctime: req.body.ctime};
	fur.findByIdAndUpdate(req.params.id, {$set : data} , function(err,furn){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/"+furn.category+"/"+furn._id)
		}
	});
})

app.delete("/delete/:id", privilage , function(req, res){
	fur.findByIdAndRemove(req.params.id, function(err,furn){
		if(err)
		{
			console.log(err);
		}
		else{
			res.redirect("/");
		}
	})
})


//   Middleware
//=======================================
    function isLoggedin(req, res, next){
    	if(req.isAuthenticated()){
    		return next();
    	}
    	res.redirect("/register");
    }


function privilage(req , res , next)
{
	if(req.isAuthenticated())
	{
		if((req.user.username) === ("admin"))
		{
             next();
		}
		else
		{
			//res.alert("Admin Privilage required");
			res.redirect("/");
		}
	}
	else{
		    //res.send("You Need to login first");
			res.redirect("/register");
	}
};

//=======================================

//=========================================================

app.listen(process.env.PORT, process.env.IP , function(req,res){
	console.log("Server Started");
})