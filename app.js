const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
const Comment       = require('./models/comment');
const seedDB        = require('./seeds.js');
const passport      = require('passport');
const LocalStrategy = require('passport-local');
const User          = require('./models/user');

seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelp-camp', { useUnifiedTopology: true, useNewUrlParser: true });

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "Super top secret code",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
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
    res.render('campgrounds/new');
});

//SHOW - shows more info about campground
app.get('/campgrounds/:id',function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});


//COMMENT ROUTES
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });

        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//AUTH ROUTES
app.get('/register', function(req, res){
    res.render("register");
});

app.post('/register', function(req, res){
    const newUser = new User({ username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

app.get('/login', function(req, res){
    res.render('login');
})

app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login'

    }), function(req, res){

});


 app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp listening on Port 3000");
 });

 
