// Dependencies
var _ = require('lodash');

module.exports = function(items, request) {
    if (!request.query.fields) {
        return items;
    }
    var keys = request.query.fields.split(',');
    return _.map(items, function(item) {
        return _.pick(item, function(value, key) {
            return _.indexOf(keys, key) >= 0;
        });
    });
};
