module.exports = function(items) {
    for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        item.id = item._id;
        delete item._id;
        delete item.__v;
        delete item.created;
        delete item.modified;
    }
    return items;
};
