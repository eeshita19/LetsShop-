var middlewareObj = {},
Campground = require("../models/campground"),

Comment = require("../models/comment");

middlewareObj.isLoggedIn=function(req ,res , next){
   if(req.isAuthenticated()){
       return next();
   }
   
   req.flash("error","Please Login First");
   res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {

            if (err) {
                req.flash("error","Shop not Found");
                res.redirect("back");
            }
            else {
                
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","You do not have permission");
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error","Please Login First");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {

        Comment.findById(req.params.comment_id, function (err, foundComment) {

            if (err) {
                req.flash("error","not Found");
                res.redirect("back");
            }
            else {

                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash("error","You do not have permission");
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error","Please Login First");
        res.redirect("back");
    }
}

module.exports = middlewareObj;