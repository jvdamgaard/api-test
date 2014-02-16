// Dependencies
// var _ = require('lodash');
var crud = require('../crud');

// Model
var User = require('../models/user');

// Filters
// var filters = {
//     brand: function(item, value) {
//         return item.brand === value;
//     }
// };

// Aliases
// var aliases = [{
//     url: '/:brand',
//     rewrite: function(req) {
//         if (_.indexOf(config.brands, req.params.brand) >= 0) {
//             req.query.brand = req.params.brand;
//             req.url = BASE_URL + '?brand=' + req.query.brand;
//         }
//     }
// }];

module.exports = function(app) {
    crud(app, User, 'users');
};
