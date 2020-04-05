const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/userModel');

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: '2542629655959579',
    clientSecret: 'cf4b13558b7db1c5d2a96ae378d17ac6'
  }, async (accessToken, refreshToken, profile, done) => {
    
    try {
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        
        //await User.deleteOne({ "name": profile.displayName })

        const existingUser = await User.findOne({ "facebookId": profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }
    
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          facebookId: profile.id,
          image: profile.photos[0].value
        });
    
        await newUser.save();

        done(null, newUser);

      } catch(error) {
        done(error, false, error.message);
      }

    })
);