const passport = require('passport');
const bcrypt = require('bcrypt'); 
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// const alertMailer = require('../mailer/testmailer');
const UserController = require("../controllers/users_controller")






//Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done) {
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            console.log("invalid username or password");
            return done(null, false);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("invalid username or password....");
            return done(null, false);
            
        }

        // alertMailer.loginAlert(user);
        console.log(email);

        return done(null, user);
    } catch (error) {
        console.log("error in finding user --> password", error);
        return done(error);
    }
}
));


// serialise the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});




// deserialise the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);

        if (!user) {
            console.log("User not found in deserialization");
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        console.log("Error in finding user in deserialization", error);
        return done(error);
    }
});


// check auth
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        req.flash('success','Logged in');
        console.log("authenticated.....");
        return next();
    }
    //if not sign in
    // req.flash('success','incorrect credentials');
    console.log("not authenticated");
    return res.redirect('/users/sign-in');
    // return res.render('user_sign_in')
}
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;