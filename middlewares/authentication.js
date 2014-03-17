module.exports = function(req, res, next) {
    req.user = {
        rateLimit: {
            reset: 900,
            limit: 100,
            remaining: 50
        }
    };
    next();
};
