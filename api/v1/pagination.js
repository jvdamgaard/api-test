// Dependencies
var _ = require('lodash');
var url = require('url');

module.exports = function(items, req, res) {
    var links = {};

    // Page and Per Page values
    var page = parseInt(req.query.page) || 1;
    var perPage = parseInt(req.query.perpage) || 30;
    if (perPage > 100 || perPage < 1) {
        perPage = 30;
    }

    var total = items.length;

    // Navigate to page
    var prevPage = page - 1;
    var nextPage = page + 1;
    var lastPage = Math.ceil(total / perPage);

    // Full URL to current ressource excl. queries
    var fullUrl = [
        req.protocol + '://', // protocol
        req.get('host'), // domain
        url.parse(req.url).pathname, // folder
    ].join('');

    // Queries excl. page
    var queries = [];
    _.forOwn(req.query, function(val, key) {
        if (key !== 'page') {
            queries.push(key + '=' + val);
        }
    });

    // First page
    var firstQuery = _.union(queries, ['page=1']).join('&');
    links.first = fullUrl + '?' + firstQuery;

    // Prev page
    if (prevPage > 0) {
        var prevQuery = _.union(queries, [
            'page=' + prevPage
        ]).join('&');
        links.prev = fullUrl + '?' + prevQuery;
    }

    // Next page
    if (nextPage <= lastPage) {
        var nextQuery = _.union(queries, [
            'page=' + nextPage
        ]).join('&');
        links.next = fullUrl + '?' + nextQuery;
    }

    // Last page
    var lastQuery = _.union(queries, ['page=' + lastPage]).join('&');
    links.last = fullUrl + '?' + lastQuery;

    // Add links to header
    res.links(links);

    // Custom header for total count of items
    res.setHeader('X-Total-Count', total);

    // Slice items to match page and perpage
    var startItem = (page - 1) * perPage;
    var endItem = startItem + perPage;
    items = items.slice(startItem, endItem);

    return items;
};
