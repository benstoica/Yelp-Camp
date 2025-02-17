const express    = require('express');
const router     = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment    = require('../models/comment');
const middleware = require('../middleware');


//Comments New
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });

        }
    });
});

//Comments Create
router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Soemthing went wrong, please try again.');
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment added');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//EDIT COMMENTS
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back');
            } else {
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//UPDATE COMMENTS
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DESTROY COMMENTS
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment Deleted');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

 
module.exports = router;