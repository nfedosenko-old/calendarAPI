const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

// load up the user model
import User from '../models/user';

// expose this function to our app using module.exports

export default (passport) => {
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  }, (email, password, done) => {
    process.nextTick(() => {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { error: 'Incorrect email' });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false, { error: 'Incorrect password' });
        }
        return done(null, user);
      });
    });
  }));

  passport.use('bearer', new BearerStrategy((token, done) => {
    User.findOne({ accessToken: token }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { error: 'Incorrect token' });
      }
      return done(null, user, { scope: 'all' });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};

