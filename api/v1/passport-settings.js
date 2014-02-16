var passport = require('passport');
var User = require('./models/user');

var BasicStrategy = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(function(username, password, done) {
    User.findById(username, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, JSON.stringify(user));
    });
}));
