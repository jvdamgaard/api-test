// Dependencies
var _ = require('lodash');
var async = require('async');
var sort = require('./sort');
var fields = require('./fields');
var pagination = require('./pagination');
var filterItems = require('./filters');
var rateLimit = require('./rateLimit');
var async = require('async');

var mockUser = {
    resetRate: 15 * 60 * 1000,
    limit: 10
};

module.exports = function(app, Model, baseUrl, filters, aliases) {

    // Aliases
    _.forEach(aliases, function(alias) {
        app.get(baseUrl + alias.url, function(req, res, next) {
            alias.rewrite(req);
            next();
        });
    });

    /////////////
    /// CREATE //
    /////////////

    var saveItem = function(body, callback) {
        var item = new Model(body);
        item.save(function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, item);
        });
    };

    // Create a single page
    app.post(baseUrl, function(req, res) {
        if (_.isArray(req.body)) {
            async.map(req.body, saveItem, function(err, items) {
                console.log(err);
                if (err) {
                    return res.json(400, err);
                }
                return res.json(201, items);
            });
        } else {
            saveItem(req.body, function(err, item) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(201, item);
            });
        }
    });

    ///////////
    /// READ //
    ///////////

    // Read a list of pages
    app.get(baseUrl, function(req, res) {
        rateLimit(res, mockUser);
        if (mockUser.remaining === 0) {
            return res.send(429);
        }
        Model.find(function(err, items) {
            if (err) {
                return res.json(400, err);
            }
            items = filterItems(filters, items, req);
            items = sort(items, req);
            items = pagination(items, req, res);
            items = fields(items, req);
            return res.json(items);
        });
    });

    // Read a single page by id
    app.get(baseUrl + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            item = fields([item], req)[0];
            return res.json(item);
        });
    });

    /////////////
    /// UPDATE //
    /////////////

    // Update a list of pages
    app.put(baseUrl, function(req, res) {
        if (!_.isArray(req.body)) {
            return res.json(404, {
                error: 'Body of request has to be an array when bulk updating'
            });
        }
        var errors = [];
        var items = [];
        async.each(req.body, function(body, next) {
            if (!body.id) {
                errors.push({
                    error: 'No id was specified for ' + JSON.stringify(body)
                });
                return next();
            }
            Model.findById(body.id, function(err, item) {
                if (err) {
                    errors.push(err);
                    return next();
                }
                item = _.assign(item, body);
                item.save(function(err) {
                    if (err) {
                        errors.push(err);
                        return next();
                    }
                    items.push(item);
                    next();
                });
            });
        }, function() {
            if (errors.length) {
                return res.json(400, errors);
            }
            res.json(items);
        });

    });

    // Update a single page by id
    app.put(baseUrl + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            item = _.assign(item, req.body);
            item.save(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(item);
            });
        });
    });

    /////////////
    /// DELETE //
    /////////////

    // Delete all pages
    app.delete(baseUrl, function(req, res) {
        Model.remove(function(err) {
            if (err) {
                return res.json(400, err);
            }
            return res.send(200);
        });
    });

    // Delete a single page by id
    app.delete(baseUrl + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            item.remove(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.send(200);
            });
        });
    });
};
