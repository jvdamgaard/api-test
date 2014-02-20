// Dependencies
var _ = require('lodash');

var post = require('./crud/post');
var getSingle = require('./crud/getSingle');
var getMultiple = require('./crud/getMultiple');
var putSingle = require('./crud/putSingle');
var putMultiple = require('./crud/putMultiple');
var deleteSingle = require('./crud/deleteSingle');
var deleteMultiple = require('./crud/deleteMultiple');

module.exports = function(app, baseUrl, Model, ressourceName, aliases) {

    // Aliases
    if (aliases) {
        _.forEach(aliases, function(alias) {
            app.get(baseUrl + alias.url, function(req, res, next) {
                alias.rewrite(req);
                next();
            });
        });
    }

    // Create single and multiple items
    app.post(baseUrl, post(Model, ressourceName));

    // Read a list of items
    app.get(baseUrl, getMultiple(Model, ressourceName));

    // Read a single item by id
    app.get(baseUrl + '/:id', getSingle(Model, ressourceName));

    // Update a list of items
    app.put(baseUrl, putMultiple(Model, ressourceName));

    // Update a single page by id
    app.put(baseUrl + '/:id', putSingle(Model, ressourceName));

    // Delete all items
    app.delete(baseUrl, deleteMultiple(Model, ressourceName));

    // Delete a single page by id
    app.delete(baseUrl + '/:id', deleteSingle(Model, ressourceName));
};
