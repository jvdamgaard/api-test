// Dependencies
var mongoose = require('mongoose');
var _ = require('lodash');
var resources = require('./config').resources;

// Conenct to database
mongoose.connect('mongodb://localhost/arkitektmn');

// Add all resources
module.exports = function(app) {
    _.forEach(resources, function(resource) {
        require('./routes/' + resource)(app);
    });
};
