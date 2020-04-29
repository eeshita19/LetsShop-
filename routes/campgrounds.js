var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground");

var middleware=require("../middleware");
//Index route 
router.get("/", function (req, res) {
    Campground.find({}, function (err, allcampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
        }
    });
});

//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data 
    const { name, image, desc, type } = req.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newCampground = { name: name, image: image, type: type, description: desc, author: author }
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log("ERROR" + err);
        }
        else {
            console.log("Added " + newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//new route

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//show 
router.get("/:id", function (req, res) {
    //finding id 
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {

    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});
//update

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    //find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//destroy 
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;