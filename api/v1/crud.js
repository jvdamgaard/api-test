// Dependencies
var _ = require('lodash');
var async = require('async');

var passport = require('passport');
require('./passport-settings');

var access = require('./access');
var sort = require('./sort');
var fields = require('./fields');
var pagination = require('./pagination');
var filterItems = require('./filters');
var rateLimit = require('./rateLimit');
var cache = require('./caching');
var config = require('./config.json');

module.exports = function(app, Model, ressourceName, filters, aliases) {

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
    app.post(baseUrl, passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (_.isArray(req.body) && !access(user, 'postMultiple', ressourceName)) {
            return res.send(403);
        }
        if (!_.isArray(req.body) && !access(user, 'postSingle', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
        }

        // Bulk create
        if (_.isArray(req.body)) {
            async.map(req.body, saveItem, function(err, items) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(201, items);
            });

            // Create single
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
    app.get(baseUrl, passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'getMultiple', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
        }

        // if (cache.get(req.url)) {
        //     return res.json(cache.get(req.url));
        // }

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

        // Pagination
        var page = parseInt(req.query.page) || 1;
        var perPage = parseInt(req.query.perpage) || 30;
        if (perPage > 100 || perPage < 1) {
            perPage = 30;
        }
        query.skip((page - 1) * perPage).limit(perPage);
        // TODO: Set link headers

        // Select fields to output
        if (req.query.fields) {
            var fieldsString = req.query.fields.split(',').join(' ');
            console.log(fieldsString);
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

    // Read a single page by id
    app.get(baseUrl + '/:id', passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'getSingle', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
        }

        if (cache.get(req.url)) {
            return res.json(cache.get(req.url));
        }

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
    app.put(baseUrl, passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'putMultiple', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
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
    app.put(baseUrl + '/:id', passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'putSingle', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
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
    app.delete(baseUrl, passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'deleteMultiple', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
        }
        Model.remove(function(err) {
            if (err) {
                return res.json(400, err);
            }
            return res.send(200);
        });
    });

    // Delete a single page by id
    app.delete(baseUrl + '/:id', passport.authenticate('basic', {
        session: false
    }), function(req, res) {
        var user = JSON.parse(req.user);

        // User has access to this ressource
        if (!access(user, 'deleteSingle', ressourceName)) {
            return res.send(403);
        }

        // Has user reached rate limit
        if (rateLimit(user, res)) {
            return res.send(429);
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
