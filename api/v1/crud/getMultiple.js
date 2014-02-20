var _ = require('lodash');
var access = require('../util/access');
var pagination = require('../util/pagination');

module.exports = function(Model, ressourceName) {
    return function(req, res) {

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

        // Count total elements
        Model.find(query).count(function(err, count) {
            if (err) {
                return res.json(400, err);
            }
            res.setHeader('X-Total-Count', count);

            // Sort
            if (req.query.sort) {
                var sortString = req.query.sort.split(',').join(' ');
                query.sort(sortString);
            }

            // Pagination
            var paginationOptions = pagination(req, res, count);
            query.skip(paginationOptions.from).limit(paginationOptions.limit);

            // Select fields to output
            if (req.query.fields) {
                var fieldsString = req.query.fields.split(',').join(' ');
                query.select(fieldsString);
            }

            // Eecute the query
            query.exec(function(err, items) {
                if (err) {
                    return res.json(400, err);
                }
                return res.json(items);
            });
        });
    };
};
