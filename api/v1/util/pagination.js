// Dependencies
var _ = require('lodash');
var url = require('url');

module.exports = function(req, res, count) {
    var links = {};

    // Page and Per Page values
    var currentPage = parseInt(req.query.page) || 1;
    var perPage = parseInt(req.query.perpage) || 30;
    if (perPage > 100 || perPage < 1) {
        perPage = 30;
    }

    var lastPage = Math.ceil(count / perPage);
    if (currentPage < 0) {
        currentPage = 0;
    } else if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    // Navigate to page
    var prevPage = currentPage - 1;
    var nextPage = currentPage + 1;

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

    // Slice items to match page and perpage
    return {
        from: (currentPage - 1) * perPage,
        limit: perPage
    };
};
