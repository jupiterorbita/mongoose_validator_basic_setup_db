

// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');





//session
var session = require('express-session');
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

const flash = require('express-flash');
app.use(flash());

//reruire mongoose module
var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose');
//Note: If you connect to a database that doesn't exist, mongoose WILL create the DB for you!

// to make a model, you can first define a schema, which is just the BLUEPRINT for a model
var UserSchema = new mongoose.Schema({
    first_name:  { type: String, required: true, minlength: 3},
    last_name: { type: String, required: true, maxlength: 20 },
    age: { type: Number, min: 1, max: 120 },
    email: { type: String, required: true }
},
{timestamps: true});
mongoose.model('User', UserSchema);// We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

// Use native promises
mongoose.Promise = global.Promise;

//Note: If you create a model, mongoose WILL create the appropriate collection in your database for you! Even with the appropriate naming (plural for collection names)!

// Routes
// Root Request
app.get('/', function(req, res) {
    User.find({}, function(err, users){
        console.log(users);
        console.log(err);
        console.log(users[0].name)
        console.log(users[0].age);
        
        console.log(users[1].name)
        res.render('index', {users: users});

    })
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    // res.render('index');
})
// Add User Request 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    console.log(req.body.name);
    console.log(req.body.age);
    
    // create a new User with the name and age corresponding to those from req.body
    var user = new User({
        first_name: req.body.fname, 
        last_name: req.body.lname,
        age: req.body.age,
        email: req.body.email
    });
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    user.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log('we have an error', err);
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/');
        } 
        else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
            res.redirect('/');
        }
    })
})



// Setting our Server to Listen on Port: 5000
app.listen(5000, function() {
    console.log("listening on port 5000");
})
