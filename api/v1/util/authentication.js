var passport = require('passport');
var User = require('../models/user');
var config = require('../config');

var setRateLimit = function(user) {
    var now = new Date().getTime() / 1000;

    if (user.rateLimit.nextReset < now) {
        user.rateLimit.nextReset = Math.ceil(now + user.rateLimit.resetRate);
        user.rateLimit.remaining = user.rateLimit.limit;
    }

    user.rateLimit.remaining--;
    if (user.rateLimit.remaining < 0) {
        user.rateLimit.remaining = 0;
    }

    user.save();
};

var BasicStrategy = require('passport-http').BasicStrategy;
passport.use(new BasicStrategy(function(username, password, done) {
    User.findById(username, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        setRateLimit(user);
        return done(null, user.toObject());
    });
}));

var setRateLimitHeaders = function(req, res, next) {
    res.setHeader('X-RateLimit-Limit', req.user.rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', req.user.rateLimit.remaining);

    var now = new Date().getTime() / 1000;
    res.setHeader('X-RateLimit-Reset', Math.ceil(req.user.rateLimit.nextReset - now));

    if (req.user.rateLimit.remaining === 0) {
        return res.send(429, {
            error: 'Rate limit has been reached.'
        });
    }

    next();
};

module.exports = function(app) {
    app.get('/v' + config.version.major + '/*', passport.authenticate('basic', {
        session: false
    }), setRateLimitHeaders);
    app.post('/v' + config.version.major + '/*', passport.authenticate('basic', {
        session: false
    }), setRateLimitHeaders);
    app.delete('/v' + config.version.major + '/*', passport.authenticate('basic', {
        session: false
    }), setRateLimitHeaders);
    app.put('/v' + config.version.major + '/*', passport.authenticate('basic', {
        session: false
    }), setRateLimitHeaders);
};
