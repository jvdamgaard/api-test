// Dependencies
var _ = require('lodash');
var requireGruntConfigs = require('require-grunt-configs');

module.exports = function(grunt) {

    var config = {
        pkg: require('./package.json')
    };

    // Load all config file in options folder
    config = _.assign(config, requireGruntConfigs(grunt, 'grunt/config'));
    grunt.initConfig(config);

    /**
     * Start node server and livereload on changes
     */
    grunt.registerTask('default', function() {
        grunt.loadNpmTasks('grunt-todos');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-shell-spawn');
        grunt.loadNpmTasks('grunt-wait');
        grunt.loadNpmTasks('grunt-express-server');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.task.run([
            'todos:all',
            'jshint:all',
            'clean',
            'shell:mongod',
            'wait:mongod',
            'shell:mongo',
            'wait:mongo',
            'express',
            'watch'
        ]);
    });
};
