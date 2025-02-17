require('dotenv').config();

const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const Campground     = require('./models/campground');
const Comment        = require('./models/comment');
const seedDB         = require('./seeds.js');
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const User           = require('./models/user');
const methodOverride = require('method-override');
const flash          = require('connect-flash');

app.locals.moment    = require('moment');

//requiring routes
const commentRoutes    = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes      = require('./routes/index');

// seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());
mongoose.set('useFindAndModify', false);
// mongoose.connect('mongodb://localhost/yelp-camp', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connect('mongodb+srv://1:1@yelpcamp.mthii.mongodb.net/YelpCamp?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });


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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');    
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

 app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YelpCamp listening on Port 3000");
 });

 
