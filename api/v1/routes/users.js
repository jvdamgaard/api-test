// Dependencies
var crud = require('../crud');

// Model
var User = require('../models/user');

module.exports = function(app) {
    crud(app, User, 'users');
};
