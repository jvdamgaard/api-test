// Dependencies
var mongoose = require('mongoose');
var mongooseCachebox = require('mongoose-cachebox');
var _ = require('lodash');
var passport = require('passport');
require('./passport-settings');
var config = require('./config');

// Cache results in-memory for 60 secs
mongooseCachebox(mongoose, {
    cache: true,
    ttl: 60
});

// Conenct to database
mongoose.connect('mongodb://localhost/arkitektmn');

// Add all resources
module.exports = function(app) {

    // Authentication
    app.all('/v' + config.version.major + '/*', passport.authenticate('basic', {
        session: false
    }));

    _.forEach(config.resources, function(resource) {
        require('./routes/' + resource)(app);
    });
};
