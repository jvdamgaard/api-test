// Dependencies
var crud = require('../crud');
var config = require('../config');

// Model
var User = require('../models/user');

var ressourceName = 'users';
var baseUrl = '/v' + config.version.major + '/' + ressourceName;

module.exports = function(app) {
    crud(app, baseUrl, User, ressourceName);
};
