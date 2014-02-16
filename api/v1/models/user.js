// Dependencies
var mongoose = require('mongoose');

// Schemas
var User = require('../schemas/user');

User.set('toJSON', {
    transform: function(doc, item) {

        // Add

        // Transform
        item.key = item._id;

        // Remove
        delete item._id;
        delete item.__v;
        delete item.created;
        delete item.modified;
    }
});

module.exports = mongoose.model('User', User);
