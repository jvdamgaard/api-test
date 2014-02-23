var aliasRewrite = require('./util/aliases');

var post = require('./restfull/post');
var getSingle = require('./restfull/getSingle');
var getMultiple = require('./restfull/getMultiple');
var putSingle = require('./restfull/putSingle');
var putMultiple = require('./restfull/putMultiple');
var deleteSingle = require('./restfull/deleteSingle');
var deleteMultiple = require('./restfull/deleteMultiple');

module.exports = function(app, baseUrl, Model, ressourceName, aliases) {

    // Aliases
    aliasRewrite(app, aliases, baseUrl);

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
