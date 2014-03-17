/**
 * Main entry for server
 *
 * - Use express server
 * - h5bp configs
 */

// Dependencies
var express = require('express');
var app = express();
var passport = require('passport');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Expose-Headers', 'X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset,X-Total-Count,Link');
    next();
};
app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(allowCrossDomain);
app.use(app.router);

// Api v1
require('./facade/router')(app);

app.listen(9000);

console.log('App running on http://localhost:9000');
