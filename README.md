# Yelp-Camp
## The application is hosted on Heroku -> [Live Demo](http://yelpcamp-bensto.herokuapp.com/)
### YelpCamp is a website where users can create and review campgrounds. Everyone can view the camps and reviews without signing up or logging in. 
### You will need an account to add campgrounds, comments, like, etc.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

# Features
- Authentication
  - In order to review or create a campground, you must have an account. Users can login or create an account, if you forget your password you can request a password reset
  - User profiles include more information on the user (full name, email, profile photo, the campgrounds they have added)
- Authorization
  - Users can create, edit, and remove campgrounds and comments only they have added
  - One cannot edit or delete posts and comments created by other users
  - Users can "like" a campground and see who else has liked it.
- Manage campgrounds
  - Users can use the search bar to search for any campground that has been added to the site
  - Display campground location and a map using Google Maps
  - Display price per night of campgrounds based on what user entered when adding the campground

  
- Flash messages responding to users’ interaction with the app
- Responsive web design
- Used momentJS to show post and campground and comment creation and update timestamp
