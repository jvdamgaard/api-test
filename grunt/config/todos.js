/**
 * Check javascript files for TODO and FIXME statements. Abort build if any of these is found
 */

// Dependencies
var grunt = require('grunt');

var todosMemo = '';
var todosFail = false;

module.exports = {
    options: {
        verbose: false,
        priorities: {
            low: null,
            med: /(TODO)/,
            high: /(BUG|FIXME)/
        },
        reporter: {
            fileTasks: function(file, tasks, options) {
                var colors = {
                    low: 'blue',
                    med: 'yellow',
                    high: 'red'
                };
                var memo = '';

                if (tasks.length === 0) {
                    if (options.verbose) {
                        memo += 'Tasks found in: '.white + file.green + '\n';
                        memo += '    ' + 'No tasks found!'.white + '\n';
                    }
                } else {
                    memo += 'Tasks found in: '.white + file.green + '\n';
                    tasks.forEach(function(task) {
                        memo += '    ' + '[Line: '.bold + task.lineNumber.toString().bold + '] '.bold + '['.bold + task.priority.toString().bold + '] '.bold + task.line.toString()[colors[task.priority]] + '\n';
                        if (task.priority === 'high') {
                            todosFail = true;
                        }
                    });
                    todosMemo += memo;
                }

                if (todosFail) {
                    memo = '';
                }

                return memo;
            },
            footer: function() {
                if (todosFail) {
                    grunt.fail.warn(todosMemo);
                }
                return '';
            }
        }
    },
    all: {
        src: [
            'api/**/*.js'
        ]

    }
};
