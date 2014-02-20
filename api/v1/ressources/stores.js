// Dependencies
var _ = require('lodash');
var config = require('../config.json');
var crud = require('../crud');

// Model
var Store = require('../models/store');

var baseUrl = '/v' + config.version.major + '/stores';

// Aliases
var aliases = [{
    url: '/:brand',
    rewrite: function(req) {
        if (_.indexOf(config.brands, req.params.brand) >= 0) {
            req.query.brand = req.params.brand;
            req.url = baseUrl + '?brand=' + req.query.brand;
        }
    }
}];

module.exports = function(app) {
    crud(app, baseUrl, Store, 'stores', aliases);
};