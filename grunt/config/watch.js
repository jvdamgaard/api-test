/**
 * Watch for changes in files and run grunt tasks whenever a change happens
 */

module.exports = {
    server: {
        files: [
            'api/**/*.*',
            'app.js'
        ],
        tasks: [
            'express:server'
        ],
        options: {
            livereload: true,
            spawn: false
        }
    }
};
