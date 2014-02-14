// Dependencies
var config = require('../config.json');
var crud = require('../crud');

// Model
var Store = require('../models/store');

// Constants
var BASE_URL = '/v' + config.version.major + '/stores';

// Filters
var filters = {
    brand: function(item, value) {
        return item.brand === value;
    }
};

// Aliases
var aliases = [{
    url: '/brand/:brand',
    rewrite: function(req) {
        req.query.brand = req.params.brand;
        req.url = BASE_URL + '?brand=' + req.query.brand;
    }
}];

module.exports = function(app) {
    crud(app, Store, BASE_URL, filters, aliases);
};
