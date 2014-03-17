var _ = require('lodash');

module.exports.get = function(data, callback) {
    callback(200, [{
        name: 'test'
    }]);
};

module.exports.getById = function(data, callback) {
    callback(200, {
        name: 'test',
        id: data.id
    });
};

module.exports.save = function(data, callback) {
    callback(200, [{
        name: 'test',
        isArray: _.isArray(data)
    }]);
};

module.exports.update = function(data, callback) {
    callback(200, data);
};

module.exports.updateById = function(data, callback) {
    callback(200, data);
};

module.exports.delete = function(data, callback) {
    callback(200, []);
};

module.exports.deleteById = function(data, callback) {
    callback(200, data.id);
};
