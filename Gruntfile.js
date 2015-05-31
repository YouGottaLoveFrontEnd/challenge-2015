'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // The actual grunt server settings
        connect: {
            server: {
                options: {
                    port: 9000,
                    // Change this to '0.0.0.0' to access the server from outside
                    hostname: '0.0.0.0',
                    keepalive: true
                }
            }
        }

    });
};
