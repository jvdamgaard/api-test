// Dependencies
var mongoose = require('mongoose');

// Schemas
var Store = require('../schemas/store');

Store.set('toJSON', {
    transform: function(doc, item) {
        item.id = item._id;
        delete item._id;
        delete item.__v;
        delete item.created;
        delete item.modified;
    }
});

module.exports = mongoose.model('Store', Store);
