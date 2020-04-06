/**
 * passport module
 * @const
 */
const passport = require('passport');

/**
 * facebook token strategy
 * @const
 */
const FacebookTokenStrategy = require('passport-facebook-token');

/**
 * user object
 * @const
 */
const User = require('./models/userModel');

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: '2542629655959579',
    clientSecret: 'cf4b13558b7db1c5d2a96ae378d17ac6'
  }, async (accessToken, refreshToken, profile, done) => {
    
    try {
        //check if the user signed up with facebook before, log him in
        const existingUser = await User.findOne({ "facebookId": profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        
        //if not, create a new user in the database
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value || "test@gmail.com",
          facebookId: profile.id,
          images: profile.photos[0].value
        });
    
        await newUser.save();

        done(null, newUser);

      } catch(error) {
        done(error, false, error.message);
      }

    })
);