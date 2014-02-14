// Dependencies
var _ = require('lodash');

module.exports = function(filters, items, request) {
    return _.filter(items, function(item) {
        var isInFilter = true;
        _.forOwn(request.query, function(val, key) {

            // Item already filtered out
            if (!isInFilter) {
                return;
            }
            if (filters[key]) {
                isInFilter = filters[key](item, val);
            }
        });
        return isInFilter;
    });
};
