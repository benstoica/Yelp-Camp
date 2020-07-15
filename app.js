const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelp-camp', { useUnifiedTopology: true, useNewUrlParser: true });


//SCHEMA SETUP

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds: allCampgrounds});
        }
    });
});

app.post('/campgrounds', function(req, res){
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
app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs');
});

//SHOW - shows more info about campground
app.get('/campgrounds/:id',function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render('show', {campground: foundCampground});
        }
    });
    req.params.id
});


 app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp listening on Port 3000");
 });

 
