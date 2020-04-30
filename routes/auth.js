var express = require("express"),
    router = express.Router(),
    passport=require("passport"),
    User=require("../models/user");

//autH routes
//SIGN UP
router.get("/register",function(req,res){
    res.render("register");
});

//HANDLING SIGN up
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Shopping " + user.username);
            return res.redirect("/campgrounds");
        });
    });
    
});

//login routes
//render login
router.get("/login",function(req,res){
    res.render("login");
});

//login logic
//middleware

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) , function(req,res){ });

//LOGOUT
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged you out!!");
    res.redirect("/campgrounds");
})




module.exports = router;