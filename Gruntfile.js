'use strict';

// Variables
var path = require('path');

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // timeline configuration
    timeline: {
      compiled: 'compiled',
      website:  '../timeline.knightlab.com'
    },
    
    // cdn configuation
    cdn: {
        repo: '../cdn.knightlab.com',
        path: path.join('..', 'cdn.knightlab.com', 'apps', 'libs', 'timeline')
    },

    // Banner for the top of CSS and JS files
    // Note: The existing Timeline repo has its own banner, so we'll ignore this for now
    banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
            ' */\n',

    // Clean
    clean: {
      stg: {
        options: { force: true },
        src: path.join('<%= cdn.path %>', '<%= pkg.version %>')
      },
      stgLatest: {
        options: { force: true },
        src: path.join('<%= cdn.path %>', 'latest')
      }
    },

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
      },
      stg: {
        files: [
          { 
            expand: true, 
            cwd: '<%= timeline.compiled %>', 
            src: ['css/**', 'js/**', 'lib/**'], 
            dest: path.join('<%= cdn.path %>', '<%= pkg.version %>')
          }
        ]
      },
      stgLatest: {
        files: [
          { 
            expand: true, 
            cwd: '<%= timeline.compiled %>', 
            src: ['css/**', 'js/**', 'lib/**'], 
            dest: path.join('<%= cdn.path %>', '<%= latest %>')
          }
        ]
      }
    }
  });

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Task aliases
  grunt.registerTask('check-for-website', 'Check for the website repository', function() {
    // Make sure CDN repo exists
    if(!grunt.file.exists(grunt.config.get('timeline.website'))) {
        grunt.fatal('Could not find local website repository.')
    }
  });
  grunt.registerTask('check-for-cdn', 'Check for the cdn.knightlab.com repository', function() {
    // Make sure CDN repo exists
    if(!grunt.file.exists(grunt.config.get('cdn.repo'))) {
        grunt.fatal('Could not find local cdn repository.')
    }
  });

  // Define complex tasks
  grunt.registerTask('website', "Copy select files to the timeline.knightlab.com website repository", 
    ['check-for-website', 'copy:website']);
  grunt.registerTask('stage', "Stage the release for deployment to the CDN", 
    ['check-for-cdn', 'clean:stg', 'copy:stg']);
  grunt.registerTask('stage-latest', "Stage the release for deployment to the CDN, and copy it to the latest directory", 
    ['stage', 'clean:stgLatest', 'copy:stgLatest']);
  
};
