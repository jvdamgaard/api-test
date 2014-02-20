// Dependencies
var _ = require('lodash');
var async = require('async');
var access = require('./util/access');
var pagination = require('./util/pagination');
var config = require('./config.json');

module.exports = function(app, Model, ressourceName, aliases) {

    var baseUrl = '/v' + config.version.major + '/' + ressourceName;

    // Aliases
    if (aliases) {
        _.forEach(aliases, function(alias) {
            app.get(baseUrl + alias.url, function(req, res, next) {
                alias.rewrite(req);
                next();
            });
        });
    }

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

    // Create page
    app.post(baseUrl, function(req, res) {

        // Bulk create
        if (_.isArray(req.body)) {
            if (!access(req.user, 'postMultiple', ressourceName)) {
                return res.send(403);
            }
            async.map(req.body, saveItem, function(err, items) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(201, items);
            });

            // Create single
        } else {
            if (!access(req.user, 'postSingle', ressourceName)) {
                return res.send(403);
            }
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

        // User has access to this ressource
        if (!access(req.user, 'getMultiples', ressourceName)) {
            return res.send(403);
        }

        var query = Model.find({});

        // Filters
        var notFilterKeys = 'sort page perpage fields'.split(' ');
        _.forOwn(req.query, function(val, key) {
            if (notFilterKeys.indexOf(key) === -1) {
                query.where(key).equals(val);
            }
        });

        // Sort
        if (req.query.sort) {
            var sortString = req.query.sort.split(',').join(' ');
            query.sort(sortString);
        }

        // Count total elements
        Model.find(query).count(function(err, count) {
            if (err) {
                return res.json(400, err);
            }
            res.setHeader('X-Total-Count', count);

            // Pagination
            var paginationOptions = pagination(req, res, count);
            query.skip(paginationOptions.from).limit(paginationOptions.limit);

            // Select fields to output
            if (req.query.fields) {
                var fieldsString = req.query.fields.split(',').join(' ');
                query.select(fieldsString);
            }

            // Optimize output
            query.lean();

            // Eecute the query
            query.exec(function(err, items) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(items);
            });
        });

    });

    // Read a single page by id
    app.get(baseUrl + '/:id', function(req, res) {

        // User has access to this ressource
        if (!access(req.user, 'getSingle', ressourceName)) {
            return res.send(403);
        }

        var query = Model.findById(req.params.id);

        // Select fields to output
        if (req.query.fields) {
            var fieldsString = req.query.fields.split(',').join(' ');
            query.select(fieldsString);
        }

        // Optimize output
        query.lean();

        query.exec(function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            return res.json(item);
        });
    });

    /////////////
    /// UPDATE //
    /////////////

    // Update a list of pages
    app.put(baseUrl, function(req, res) {

        // User has access to this ressource
        if (!access(req.user, 'putMultiple', ressourceName)) {
            return res.send(403);
        }
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

        // User has access to this ressource
        if (!access(req.user, 'putSingle', ressourceName)) {
            return res.send(403);
        }
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

        // User has access to this ressource
        if (!access(req.user, 'deleteMultiple', ressourceName)) {
            return res.send(403);
        }

        Model.remove(function(err) {
            if (err) {
                return res.json(400, err);
            }
            return res.send(200);
        });
    });

    // Delete a single page by id
    app.delete(baseUrl + '/:id', function(req, res) {

        // User has access to this ressource
        if (!access(req.user, 'deleteSingle', ressourceName)) {
            return res.send(403);
        }

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
