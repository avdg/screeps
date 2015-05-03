module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        blanket: {
            coverage: {
                src: ['scripts/'],
                dest: 'lib-cov/scripts/'
            }
        },
        copy: {
            coverage: {
                expand: true,
                src: ['test/**', 'lib/mocks/**'],
                dest: 'lib-cov/'
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
            }
        },
        screeps: {
            options: {
                email: null,
                password: null
            },
            dist: {
                src: ['scripts/*.js']
            }
        }
    });

    grunt.task.registerTask('test', [
        'blanket',
        'copy',
        'mochaTest',
        'coveralls'
    ]);

    grunt.task.registerTask('default', [
        'test'
    ]);
};