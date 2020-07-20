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

//requiring routes
const commentRoutes    = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes      = require('./routes/index');

// seedDB();
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

 app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp listening on Port 3000");
 });

 
