const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');
require('dotenv').config();


passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        done(null, user);
    });    
});



passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID ,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
        }, (accessToken, refreshToken, profile, done)=>{
        User.findOne({googleID:profile._json.sub})
        .then(currentUser=>{
            if(currentUser){
                console.log('user Exists');
                done(null, currentUser);
            }
            else{
                new User({
                    username:profile._json.name,
                    googleID:profile._json.sub,
                    thumbnail:profile._json.picture
                })
                .save().then(newUser=>{
                    console.log('Wow, new user in database is created.');
                    done(null, newUser);
                })
            }
        })
    })
);