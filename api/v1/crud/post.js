var async = require('async');
var _ = require('lodash');
var access = require('../util/access');

module.exports = function(Model, ressourceName) {
    var saveItem = function(body, callback) {
        var item = new Model(body);
        item.save(function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null, item);
        });
    };
    return function(req, res) {

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
    };
};