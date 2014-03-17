module.exports = function(req, res, next) {
    if (!req.user || !req.user.rateLimit) {
        console.log('- error: user middleware should be instantiated before the rate limit middleware');
        return next();
    }
    res.setHeader('X-RateLimit-Limit', req.user.rateLimit.limit);
    res.setHeader('X-RateLimit-Remaining', req.user.rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', req.user.rateLimit.reset);
    next();
};
