 const express = require('express');
 const app = express();
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    const campgrounds = 
    [
        {name: "Salmon Creek", image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "Granite Hill", image:"https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350"}
    ]

    res.render('campgrounds', {campgrounds: campgrounds});
});




 app.listen(3000, process.env.IP, function(){
    console.log("YelpCamp listening on Port 3000");
 });

 
