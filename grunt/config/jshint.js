/**
 * Static analysis of javascript code quality.
 */

module.exports = {
	options: {
		jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
	},

	// Lint all js files
	all: {
		files: {
			src: [
				'api/**/*.js'
			]
		}
	}
};