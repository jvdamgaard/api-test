// Dependencies
var mongoose = require('mongoose');
var mongooseCachebox = require('mongoose-cachebox');
var _ = require('lodash');
var config = require('./config');
var authentication = require('./util/authentication');

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
    authentication(app);

    _.forEach(config.resources, function(resource) {
        require('./ressources/' + resource)(app);
    });
};
