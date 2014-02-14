/**
 * Main entry for server
 *
 * - Use express server
 * - h5bp configs
 */

// Dependencies
var express = require('express');
var app = express();

app.use(express.compress());
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);

// Api v1
require('./api/v1/api')(app);

app.listen(9000);

console.log('App running on http://localhost:9000');
