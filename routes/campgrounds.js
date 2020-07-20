const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campground');

router.get('/', function(req, res){
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
    const newCampground = {name: name, image: image, description:description};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err) {
            console.log(err);
        } else {
    res.redirect('/campgrounds');
        }
    });
});

//NEW-form to create new campground
router.get('/new', function(req, res) {
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
 
module.exports = router;