const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campground');

router.get('/', isLoggedIn, function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

router.post('/', function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, image: image, description:description, author: author};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//NEW-form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//SHOW - shows more info about campground
router.get('/:id',function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}; 
 
module.exports = router;