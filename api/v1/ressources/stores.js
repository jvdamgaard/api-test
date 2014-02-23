// Dependencies
var _ = require('lodash');
var config = require('../config.json');
var crud = require('../crud');

// Model
var Store = require('../models/store');

var ressourceName = 'stores';
var baseUrl = '/v' + config.version.major + '/' + ressourceName;

// Aliases
var aliases = [{
    method: 'get',
    src: '/:brand',
    // dist: '?brand=:brand', // default value
    match: {
        brand: function(brand) {
            return _.indexOf(config.brands, brand) >= 0;
        }
    }
}];

module.exports = function(app) {
    crud(app, baseUrl, Store, ressourceName, aliases);
};
