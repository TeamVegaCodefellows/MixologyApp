'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-mongoimport');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mongo-drop');
    grunt.loadNpmTasks('grunt-mocha-cov');
    grunt.loadNpmTasks('grunt-concurrent');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            options: {

            },
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            }
        },
        clean: {
            build: ['build'],
            dev: {
                src: ['build/**/*']
            },
            prod: ['dist']
        },
        casper: {
          acceptance : {
            options : {
              test : true,
              //'log-level': 'debug'
            },
            files : {
              'test/acceptance/casper-results.xml' : ['test/acceptance/*_test.js']
            }
          }
        },
        copy: {
            prod: {
                expand: true,
                cwd: 'app/assets',
                src: ['foundation/*.css', '*.html', 'images/**/*'],
                dest: 'dist/',
                flatten: false,
                filter: 'isFile'
            },
            dev: {
                expand: true,
                cwd: 'app',
                src: ['styles/foundation/*.css', '*.html', 'assets/images/**/*', 'js/vendor/**/*', 'templates/**/*'],
                dest: 'build/',
                flatten: false,
                filter: 'isFile'
            }
        },
        browserify: {
            prod: {
                src: ['app/js/*.js'],
                dest: 'dist/browser.js',
                options: {
                    transform: ['debowerify', 'hbsfy'],
                    debug: false
                }
            },
            dev: {
                src: ['app/js/backbone/**/*.js'],
                dest: 'build/browser.js',
                options: {
                    transform: ['debowerify', 'hbsfy'],
                    debug: true
                }
            }
        },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'server.js',
                    node_env: 'development'
                }
            },
            prod: {
                options: {
                    script: 'server.js',
                    node_env: 'production'
                }
            },
            test: {
                options: {
                    script: 'server.js',
                    node_env: 'test'
                }
            }
        },
        sass: {
            dist: {
                files: {
                    'build/styles/main.css': 'app/styles/main.scss'
                }
            },
            dev: {
                options: {
                    includePaths: ['app/styles/scss/'],
                    sourceComments: 'map'
                },
                files: {
                    'build/styles/main.css': 'app/styles/main.scss'
                }
            }
        },
        mochacov: {
            coverage: {
                options: {
                    reporter: 'mocha-term-cov-reporter',
                    coverage: true
                }
            },
            coveralls: {
                options: {
                    coveralls: {
                        serviceName: 'travis-ci'
                    }
                }
            },
            unit: {
                options: {
                    reporter: 'spec',
                    require: ['chai']
                }
            },
            html: {
                options: {
                    reporter: 'html-cov',
                    require: ['chai']
                }
            },
            options: {
                files: 'test/*.js',
                ui: 'bdd',
                colors: true
            }
        },
        watch: {
            all: {
                files: ['server.js', 'test/**.js', 'app/**/*', 'api/**/*'],
                options: {
                  livereload: true
                },
                tasks: ['test', 'build:dev']
            },
            dev: {
                files: ['app/js/model/**/*'],
                tasks: ['server']
            },
            backbone: {
                files: ['app/js/backbone/**/*.js'],
                tasks: ['build:dev', 'express:dev']
            },
            notest: {
              files: ['server.js', 'test/**.js', 'app/**/*', 'api/**/*'],
              options: {
                livereload: true
              },
              tasks: ['build:dev']
            }
            // express: {
            //     files: ['server.js', 'api/**/*', 'app/**/*', 'app/js/*.js'],
            //     tasks: ['build:dev', 'browserify:dev', 'express:dev'],
            //     options: {
            //         // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
            //         // Without this option specified express won't be reloaded
            //         spawn: false
            //     }
            // }
        },
        mongoimport: {
          options: {
              db: 'mixology-development',
              //optional
              //host : 'localhost',
              //port: '27017',
              //username : 'username',
              //password : 'password',
              //stopOnError : false,
              collections: [
                  {
                      name: 'drinks',
                      type: 'json',
                      file: 'db/seeds/drinks.json',
                      jsonArray: true, //optional
                      upsert: true, //optional
                      drop: true //optional
                  },
                  {
                      name: 'firstquestions',
                      type: 'json',
                      file: 'db/seeds/firstQuestion.json',
                      jsonArray: true, //optional
                      upsert: true, //optional
                      drop: true //optional
                  },
                  {
                      name: 'secondquestions',
                      type: 'json',
                      file: 'db/seeds/secondQuestion.json',
                      jsonArray: true, //optional
                      upsert: true, //optional
                      drop: true //optional
                  },
            ]
          }
        },
        mongo_drop: {
            test: {
                'uri': 'mongodb://localhost/mixology-development'
            },
            prod: {
                'uri': 'mongodb://localhost/mixology-prod'
            }
        },
    });

	grunt.registerTask('default',['express:dev', 'watch:express']);
    grunt.registerTask('server', ['build:dev', 'express:dev','watch:all']);
    grunt.registerTask('test', ['env:dev', 'mongo_drop', 'mongoimport', 'mochacov:unit', 'mochacov:coverage']);
    grunt.registerTask('test:acceptance',['build:dev', 'express:dev', 'casper']);
    grunt.registerTask('travis', ['mochacov:unit', 'mochacov:coverage', 'mochacov:coveralls']);
    grunt.registerTask('build:dev', ['clean:dev', 'sass:dev', 'browserify:dev', 'copy:dev']);
    grunt.registerTask('server:notest', ['build:dev', 'express:dev', 'watch:notest']);
};
