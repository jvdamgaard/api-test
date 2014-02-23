// Dependencies
var restfull = require('../restfull');
var config = require('../config');

// Model
var User = require('../models/user');

var ressourceName = 'users';
var baseUrl = '/v' + config.version.major + '/' + ressourceName;

module.exports = function(app) {
    restfull(app, baseUrl, User, ressourceName);
};
