// Dependencies
var _ = require('lodash');
var User = require('./models/user');

module.exports = function(user, res) {
    var now = new Date().getTime();
    var nextReset = Math.ceil(now / user.rateLimit.resetRate) * user.rateLimit.resetRate;

    // Reset limit
    if (!user.rateLimit.currentReset || user.rateLimit.currentReset < nextReset) {
        user.rateLimit.currentReset = nextReset;
        user.rateLimit.remaining = user.rateLimit.limit;
    }

    user.rateLimit.remaining--;
    if (user.rateLimit.remaining < 0) {
        user.rateLimit.remaining = 0;
    }

    res.setHeader('X-RateLimit-Limit', user.rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', user.rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((nextReset - now) / 1000));

    User.findById(user.id, function(err, dbUser) {
        if (!err) {
            dbUser = _.assign(dbUser, user);
            dbUser.save();
        }
    });

    if (user.rateLimit.remaining === 0) {
        return true;
    }
    return false;
};
