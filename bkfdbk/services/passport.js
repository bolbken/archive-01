const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const user = mongoose.model('users');

passport.serializeUser((user, done) => {
    let err = null;
    done(err, user.id);
});

passport.deserializeUser(async (id, done) => {
    const userVar = await user.findById(id)
    let err = null;
    done(err, userVar);
    
});

// passport.deserializeUser((id, done) => {
//     user.findById(id).then( (user) => {
//         let err = null;
//         done(err, user);
//     });
// });

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, 
    
    async (accessToken, refreshToken, profile, done) => {
        const existingUser = await user.findOne({ googleId: profile.id})
        if(existingUser) {
            // We have an existing user in our user database already
            let err = null;
            return done(err, existingUser);
        }
        
        // We don't have an existing user in the user database, need to add one.
        const newUser = await new user({googleId: profile.id }).save()
        let err = null;
        done(err, newUser);
        
    })
);