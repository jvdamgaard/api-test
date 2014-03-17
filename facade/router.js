// Dependencies
var _ = require('lodash');
var ressources = require('../config/ressources');

var app;
var httpMethods = 'get,post,put,delete'.split(',');

var setRessourceMiddleware = function(ressource) {
    if (!_.isArray(ressource.middlewares)) {
        return console.log('- info: Ressource `' + ressource.name + '` has no middlewares configured');
    }
    ressource.middlewares.forEach(function(middlewareName) {
        var middleware = require('../' + middlewareName);
        httpMethods.forEach(function(httpMethod) {
            app[httpMethod]('/v' + ressource.version + '/' + ressource.name + '/*', middleware);
        });
    });
};

var setRessourceRouter = function(ressource) {

    var service = require('../' + ressource.service);

    _.forOwn(ressource.routes, function(routes, httpMethod) {
        if (_.indexOf(httpMethods, httpMethod) === -1) {
            return console.log('- error: Ressource `' + ressource.name + '` has a not valid http router `' + httpMethod + '` configured');
        }
        _.forOwn(routes, function(serviceMethod, url) {
            app[httpMethod]('/v' + ressource.version + '/' + ressource.name + url, function(req, res) {
                var data = {
                    body: req.body
                };
                data = _.assign(data, req.query);
                data = _.assign(data, req.params);
                service[serviceMethod](data, function(status, body) {
                    res.json(body);
                });
            });
        });
    });
};

var addRessource = function(ressource) {
    if (!_.isString(ressource.name)) {
        return console.log('- error: Ressource `' + ressource.name + '` has no valid `name` configured');
    }
    if (!_.isNumber(ressource.version)) {
        return console.log('- error: Ressource `' + ressource.name + '` has no valid `version` configured');
    }
    if (!_.isObject(ressource.routes)) {
        return console.log('- error: Ressource `' + ressource.name + '` has no `routes` configured');
    }
    if (!_.isString(ressource.service)) {
        return console.log('- error: Ressource `' + ressource.name + '` has no `service` configured');
    }
    setRessourceMiddleware(ressource);
    setRessourceRouter(ressource);
};

module.exports = function(expressApp) {
    app = expressApp;
    if (!_.isArray(ressources)) {
        return console.log('- error: no ressources defined');
    }
    ressources.forEach(addRessource);
};
