// Dependencies
var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

// Schema
var Store = require('../schemas/store');
Store.plugin(timestamps);

Store.set('toJSON', {
    transform: function(doc, item) {

        // Add

        // Transform
        item.id = item._id;

        // Remove
        delete item._id;
        delete item.__v;
    }
});

module.exports = mongoose.model('Store', Store);
