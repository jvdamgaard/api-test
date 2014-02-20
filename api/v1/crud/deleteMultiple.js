var access = require('../util/access');

module.exports = function(Model, ressourceName) {
    return function(req, res) {

        // User has access to this ressource
        if (!access(req.user, 'deleteMultiple', ressourceName)) {
            return res.send(403);
        }

        Model.remove(function(err) {
            if (err) {
                return res.json(400, err);
            }
            return res.send(200);
        });
    };
};
