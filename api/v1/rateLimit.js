module.exports = function(res, options) {
    var now = new Date().getTime();
    var nextReset = Math.ceil(now / options.resetRate) * options.resetRate;

    // Reset limit
    if (!options.currentReset || options.currentReset < nextReset) {
        options.currentReset = nextReset;
        options.remaining = options.limit;
    }

    options.remaining--;
    if (options.remaining < 0) {
        options.remaining = 0;
    }

    res.setHeader('X-RateLimit-Limit', options.limit);
    res.setHeader('X-RateLimit-Remaining', options.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil((nextReset - now) / 1000));
};
