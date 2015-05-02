module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        mochaTest: {
            test: {
                src: 'test/**/*.js',
                options: {
                    slow: 20
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
        'mochaTest'
    ]);

    grunt.task.registerTask('default', [
        'test'
    ]);
};