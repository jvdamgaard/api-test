// Dependencies
var _ = require('lodash');
var url = require('url');
var config = require('../config.json');
var crud = require('../crud');

// Model
var Store = require('../models/store');

var ressourceName = 'stores';
var baseUrl = '/v' + config.version.major + '/' + ressourceName;

// Aliases
var aliases = [{
    url: '/:brand',
    rewrite: function(req) {
        console.log(req.params.brand);
        if (_.indexOf(config.brands, req.params.brand) >= 0) {
            req.query.brand = req.params.brand;
            var reqUrl = url.parse(req.url, true);
            reqUrl.query.brand = req.params.brand;
            reqUrl.pathname = baseUrl;
            req.url = url.format(reqUrl);
            console.log(req.url);
        }
    }
}];

module.exports = function(app) {
    crud(app, baseUrl, Store, ressourceName, aliases);
};
