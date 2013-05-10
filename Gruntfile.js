'use strict';

// Variables
var path = require('path');

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    // Configs
    pkg: grunt.file.readJSON('package.json'),
    timeline: {
      compiled: 'compiled',
      website:  '../timeline.knightlab.com'
    },

    // Banner for the top of CSS and JS files
    // Note: The existing Timeline repo has its own banner, so we'll ignore this for now
    banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            ' */\n',

    // Copy
    copy: {
      website: {
        files: [
          // Styles/Themes
          { expand: true, cwd: '<%= timeline.compiled %>/css', src: ['*.css', 'themes/**'], dest: '<%= timeline.website %>/static/css'},
          
          // Scripts
          { expand: true, cwd: '<%= timeline.compiled %>/js', src: ['**/*.js'], dest: '<%= timeline.website %>/static/js'},
          
          // Images
          { expand: true, cwd: '<%= timeline.compiled %>/css', src: ['*.{png,gif,jpg}'], dest: '<%= timeline.website %>/static/img'}
        ]
      }
    }
  });

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Task aliases
  grunt.registerTask('check', 'Check for the timeline.knightlab.com repository', function() {
    // Make sure CDN repo exists
    if(!grunt.file.exists(grunt.config.get('timeline.website'))) {
        grunt.fatal('Could not find local website repository.')
    }
  });

  grunt.registerTask('website', "Copy select files to the timeline.knightlab.com website repository", ['check', 'copy']);
};
