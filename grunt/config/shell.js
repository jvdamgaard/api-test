/**
 * Run shell tasks
 */

// Dependencies
var path = require('path');

console.log(__dirname);

module.exports = {
    mongo: {
        command: 'mongo',
        options: {
            async: true
        }
    },
    mongod: {
        command: 'mongod --dbpath ' + path.resolve(__dirname, '../../data'),
        options: {
            async: true
        }
    }
};
