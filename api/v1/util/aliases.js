// Dependencies
var _ = require('lodash');
var url = require('url');

var isParamsMatching = function(params, match) {
    var matching = true;
    if (!match) {
        return false;
    }
    _.forOwn(params, function(val, key) {
        if (matching && match[key]) {
            if (!match[key](val)) {
                matching = false;
            }
        }
    });
    return matching;
};

var rewriteAlias = function(alias, baseUrl) {
    return function(req, res, next) {
        // Only rewrite request if all matches
        if (!isParamsMatching(req.params, alias.match)) {
            return next();
        }

        // Default dist
        if (!alias.dist) {
            var distQueries = [];
            _.forOwn(req.params, function(val, key) {
                distQueries.push(key + '=:' + key);
            });
            alias.dist = '?' + distQueries.join('&');
        }

        var newUrl = url.parse(baseUrl + alias.dist, true);

        // Rewrite query
        _.forOwn(newUrl.query, function(val, key) {
            if (_.indexOf(val, ':') === 0) {
                val = val.replace(':', '');
                newUrl.query[key] = req.params[val];
            }
        });
        newUrl.query = _.assign(newUrl.query, req.query);

        // New url
        var formattedUrl = newUrl.pathname;
        var formattedQueries = _.pairs(newUrl.query);
        if (formattedQueries) {
            var queries = [];
            _.forEach(formattedQueries, function(query) {
                queries.push(query.join('='));
            });
            formattedUrl += '?' + queries.join('&');
        }

        req.query = newUrl.query;
        req.url = formattedUrl;
        next();
    };
};

module.exports = function(app, aliases, baseUrl) {
    if (!aliases) {
        return;
    }

    _.forEach(aliases, function(alias) {
        app[alias.method](baseUrl + alias.src, rewriteAlias(alias, baseUrl));
    });
};
