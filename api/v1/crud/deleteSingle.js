var access = require('../util/access');

module.exports = function(Model, ressourceName) {
    return function(req, res) {

        // User does not have access to this ressource
        if (!access(req.user, 'deleteSingle', ressourceName)) {
            return res.send(403);
        }

        Model.findById(req.params.id, function(err, item) {
            if (err) {
                return res.json(404, err);
            }
            item.remove(function(err) {
                if (err) {
                    return res.json(400, err);
                }
                return res.send(200);
            });
        });
    };
};
