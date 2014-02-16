/**
 * Clean files and folders
 */

module.exports = {
    options: {
        delay: 1000
    },
    mongod: {
        options: {
            before: function() {
                console.log('Waiting for mongod to start');
            },
            after: function() {}
        }
    },
    mongo: {
        options: {
            before: function() {
                console.log('Waiting for mongo to start');
            },
            after: function() {}
        }
    },
};
