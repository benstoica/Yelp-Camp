const express      = require('express');
const router       = express.Router();
const Campground   = require('../models/campground');
const middleware   = require('../middleware');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
        }
    });
});

//CREATE-add new campbground
router.post('/', middleware.isLoggedIn, function(req, res){
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length){
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        const lat = data[0].latitude;
        const lng = data[0].longitude;
        const location = data[0].formattedAddress;

        const newCampground = {name: name, price: price, image: image, description:description, author: author, location: location, lat: lat, lng: lng};
    
        Campground.create(newCampground, function(err, newlyCreated){
            if(err) {
                console.log(err);
            } else {
                res.redirect('/campgrounds');
            }
        });
    });
});

//NEW-form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

//SHOW - shows more info about campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//EDIT 
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length){
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if(err){
                res.redirect('/campgrounds');
            } else {
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });
});

//DESTROY
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;