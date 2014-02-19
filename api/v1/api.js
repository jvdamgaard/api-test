// Dependencies
var mongoose = require('mongoose');
var mongooseCachebox = require('mongoose-cachebox');
var _ = require('lodash');
var resources = require('./config').resources;

mongooseCachebox(mongoose, {
    cache: true,
    ttl: 60 // 60 seconds
});

// Conenct to database
mongoose.connect('mongodb://localhost/arkitektmn');

// Add all resources
module.exports = function(app) {
    _.forEach(resources, function(resource) {
        require('./routes/' + resource)(app);
    });
};
