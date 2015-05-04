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
            },
            deploy: {
                expand: true,
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

    grunt.task.registerTask('check', [
        'mochaTest:test'
    ]);

    grunt.task.registerTask('deploy', [
        'copy:deploy',
        'screeps'
    ]);

    grunt.task.registerTask('test', [
        'blanket',
        'copy:coverage',
        'mochaTest',
        'coveralls'
    ]);

    grunt.task.registerTask('default', [
        'test'
    ]);
};