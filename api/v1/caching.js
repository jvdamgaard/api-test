var cacheReset = require('./config').cacheReset;

var cache = {};

var resetCache = function() {
    cache = {};
    setTimeout(resetCache, cacheReset);
};
resetCache();

module.exports.get = function(url) {
    var key = new Buffer(url).toString('base64');
    return cache[key];
};

module.exports.set = function(url, val) {
    var key = new Buffer(url).toString('base64');
    cache[key] = val;
};
