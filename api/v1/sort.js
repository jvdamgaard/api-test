// Dependencies
var _ = require('lodash');

module.exports = function(items, request) {
    if (!request.query.sort) {
        return items;
    }
    var keys = request.query.sort.split(',');
    _.forEachRight(keys, function(key) {
        if (key.indexOf('-') === 0) {
            key = key.substring(1);
            items = _.sortBy(items, key).reverse();
        } else {
            items = _.sortBy(items, key);
        }
    });
    return items;
};
