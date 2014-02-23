/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    {%= short_name %}: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!',
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

    // internal name for watch 
    delta: {
      test: {
        files: ['tasks/**/*.js', 'test/**/*.js'],
        tasks: ['default'],
      },
      debug: {
        options: {
          spawn: false,
        },
        files: ['tasks/**/*.js', 'test/**/*.js'],
        tasks: ['shell:debug'],
      },
    },

    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'node --debug-brk $(which grunt) test'
      }
    },
 
    // run node-inspector and unit tests concurrently
    'node-inspector':{
      default: {}
    },

    concurrent: {
      test: ['node-inspector', 'shell:debug', 'delta:debug'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');
  
  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', '{%= short_name %}', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

  // continuous testing
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', ['default', 'delta:test' ] );

  // debuging.
  grunt.registerTask('debug', ['concurrent:test']);
};
