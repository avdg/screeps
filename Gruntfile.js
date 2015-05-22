'use strict';

module.exports = function(grunt) {

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        blanket: {
            coverage1: {
                src: ['scripts/'],
                dest: 'lib-cov/scripts/'
            },
            coverage2: {
                src: ['lib/codegen'],
                dest: 'lib-cov/lib/codegen'
            },
            coverage3: {
                src: ['extensions'],
                dest: 'lib-cov/extensions'
            }
        },
        clean: {
            deploy: ['build'],
            test: ['coverage', 'lib-cov'],
        },
        copy: {
            coverage: {
                expand: true,
                src: ['test/**', 'lib/mocks/**'],
                dest: 'lib-cov/'
            },
            deploy: {
                expand: true,
                flatten: true,
                src: ['scripts/**'],
                dest: 'build/deploy'
            }
        },
        coveralls: {
            options: {
                force: true
            },
            coverage: {
                src: 'coverage/lcov.info'
            }
        },
        mochaTest: {
            test: {
                src: 'test/**/*.js',
                options: {
                    slow: 20
                }
            },
            coverage: {
                src: 'lib-cov/test/**/*.js',
                options: {
                    reporter: 'mocha-lcov-reporter',
                    quiet: true,
                    captureFile: 'coverage/lcov.info'
                }
            },
            'html-coverage': {
                src: 'lib-cov/test/**/*.js',
                options: {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'coverage/coverage.html'
                }
            }
        },
        screeps: {
            options: {
                email: null,
                password: null
            },
            dist: {
                src: ['build/deploy/*.js']
            }
        }
    });

    grunt.task.registerTask('codegen', [
        'clean:deploy',
        'copy:deploy',
        'screepsCodeGenerator',
        'eslint-mapper'
    ]);

    grunt.task.registerTask('check', [
        'mochaTest:test'
    ]);

    grunt.task.registerTask('deploy', [
        'codegen',
        'screeps'
    ]);

    grunt.task.registerTask('run', 'Dry running a bot', function() {
        var result = require('child_process').execSync('node lib\\simulator\\run.js', {
            encoding: 'utf-8'
        });

        if (typeof result === "object") {
            console.log(Object.keys(result), JSON.stringify(result.error), result.file, result.stdout);
        } else {
            console.log(result);
        }
    });

    grunt.task.registerTask('setup', [
        'codegen'
    ]);

    grunt.task.registerTask('test', [
        'clean:test',
        'blanket',
        'copy:coverage',
        'mochaTest',
    ]);

    grunt.task.registerTask('travis', [
        'clean:test',
        'blanket',
        'copy:coverage',
        'mochaTest:test',
        'mochaTest:coverage',
        'coveralls',
        'run'
    ]);

    grunt.task.registerTask('default', [
        'test'
    ]);
};