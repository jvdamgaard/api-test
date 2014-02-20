// Dependencies
var crud = require('../crud');
var config = require('../config');

// Model
var User = require('../models/user');

var baseUrl = '/v' + config.version.major + '/users';

module.exports = function(app) {
    crud(app, baseUrl, User, 'users');
};
