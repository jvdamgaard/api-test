var access = require('../util/access');

module.exports = function(Model, ressourceName) {
    return function(req, res) {

        // User does not have access to this ressource
        if (!access(req.user, 'getSingle', ressourceName)) {
            return res.send(403);
        }

        var query = Model.findById(req.params.id);

        // Select fields to output
        if (req.query.fields) {
            var fieldsString = req.query.fields.split(',').join(' ');
            query.select(fieldsString);
        }

        query.exec(function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            return res.json(item);
        });
    };
};
