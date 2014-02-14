// Dependencies
var mongoose = require('mongoose');

// Schemas
var Store = require('../schemas/store');

module.exports = mongoose.model('Store', Store);
