module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      app: 'smpl',
      css: '<%= config.app %>/css',
      js:  '<%= config.app %>/js'
    },

    // grunt-contrib-watchの設定(ウォッチ対象の設定)
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
      },
      js: {
        files: ['<%= config.js %>/**/*.js'],
        // tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },


      livereload: {
        files: [
          '<%= config.app %>/**/*.html',
          //'smpl/images/*.{png,jpg,jpeg,gif,webp,svg}',
          //'smpl/fonts/**/*.*',
          // '.tmp/styles/*.css'
        ],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    },

    // grunt-contrib-connectの設定(Webサーバの設定)
    connect: {
      options: {
        port: 9000,
        hostname: '*',
        livereload: 35729,
        base: '<%= config.app %>'
      },
      livereload: {
        options: {
          // debug: true,
          open: false,
          base: '<%= config.app %>'
          // middleware: function (connect) {
          //   return [
          //     // proxySnippet,
          //     // modRewrite([
          //     //   '^/signin$ /signin.html [L]',
          //     //   '^[^\\.]*$ /index.html [L]'
          //     // ]),
          //     serveStatic('.tmp'),
          //     connect().use('/libs',serveStatic('./libs')),
          //     serveStatic('smpl')
          //   ];
          // }
        }
      }
    },

    concurrent: {
      server: [
      ]
    }

  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    grunt.task.run([
      // 'clean:server',
      // 'ngconstant:' + env,
      // 'bower:install',
      'concurrent:server',
      // 'express:api',
      // 'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });
};
