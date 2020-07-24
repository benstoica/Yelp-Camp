const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {     
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('back');
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have the required permission to complete this task.');
                    res.redirect('back');
                    }                    
            }
        });
    } else {
        req.flash('error', 'You must be logged in to do this, please login or sign up.');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have the required permission to complete this task.');
                    res.redirect('back');
                }                    
            }
        });
    } else {
        req.flash('error', 'You must be logged in to do this, please login or sign up.');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must be logged in to do this, please login or sign up.');
    res.redirect('/login');
}; 


module.exports = middlewareObj;