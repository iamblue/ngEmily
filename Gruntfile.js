'use strict';

function indentToLet (src) {
  return src.split('\n').reduce(function (array, line) {
    array.push('  ', line, '\n'); 
    return array;
  }, ['let\n']).join('');
}
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    srcDir: './src',
    baseFileName: 'dist/<%= pkg.name %>',
    watch: {
      src: {
        files: '<%= srcDir %>/**/*.js',
        tasks: ['build'],
        options: {
          livereload: true
        }
      },
      lsall: {
        files: ['src/**/*.ls'],
        tasks: ['jsall']
      },
      demo: {
        files: './demo/**/*',
        options: {
          livereload: true
        }
      }
    },
    concat: {
      livescript: {
        src: ['<%= srcDir %>/*.ls','<%= srcDir %>/ngEmily.ls'
        ],
        // dest: 'tmp/.ls-cache/<%= pkg.name %>.ls'
        dest: 'tmp/<%= pkg.name %>.ls'
        //options: { process: indentToLet }
      },
      dist: {
        src: [
          'tmp/<%= pkg.name %>.ls',
        ],
        dest: '<%= baseFileName %>.js'
      }
    },
    livescript: {
      dist: {
        src: '<%= concat.livescript.dest %>',
        dest: 'tmp/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> | ' +
          'Copyright (c) 2013 Po-Ju Chen <tonyone0902@gmail.com> */\n\n'
      },
      dist: {
        options: {
          mangle: false,
          beautify: true,
          compress: false
        },
        files: {
          '<%= baseFileName %>.js': ['tmp/<%= pkg.name %>.js']
        }
      },
      min: {
        options: {
          sourceMap: '<%= baseFileName %>.map'
        },
        files: {
          '<%= baseFileName %>.min.js': ['tmp/<%= pkg.name %>.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-livescript');

  grunt.registerTask('lsall', ['concat:livescript', 'livescript']);
  grunt.registerTask('jsall', ['lsall', 'concat:dist']);

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['build', 'watch']);
};