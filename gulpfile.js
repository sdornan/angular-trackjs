(function () {
  var gulp = require('gulp'),
    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    coveralls = require('gulp-coveralls'),
    stylish = require('jshint-stylish'),
    pkg = require('./package.json'),
    SRC_FILES = 'src/angular-trackjs.js',
    karmaTestFiles = [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      SRC_FILES,
      'test/spec/**/*Spec.js'
    ],
    cleanItems = ['coverage', 'test/coverage'],
    logError = function (err) {
      console.log(err.toString());
    };


  /**
   * Test Tasks
   */

  gulp.task('karma', function () {
    return gulp.src(karmaTestFiles)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', logError);
  });

  gulp.task('jshint', function () {
    return gulp.src(SRC_FILES)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'))

  });

  gulp.task('coveralls', ['test'], function() {
    return gulp.src(['test/coverage/**/lcov.info'])
      .pipe(coveralls());
  });

  /**
   * Build Tasks
   */

  gulp.task('build', ['clean'], function () {
    return gulp.src(SRC_FILES)
      .pipe(header([
        '/*!',
        ' * <%= title %> v<%= version %>',
        ' *',
        ' * © <%= new Date().getFullYear() %>, <%= author %>',
        ' */\n\n'
      ].join('\n'), pkg))
      .pipe(ngAnnotate())
      .pipe(gulp.dest('dist/'))
      .pipe(rename('angular-trackjs.min.js'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(header([
        '/*! <%= title %> v<%= version %> © <%= new Date().getFullYear() %> <%= author %> */\n'
      ].join(''), pkg))
      .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('clean', function () {
    return gulp.src(cleanItems)
      .pipe(clean());
  });

  /**
   * Watch Task
   */

  gulp.task('watch', function () {
    gulp.watch(['src/*.js', 'test/spec/**/*.js'], ['default']);
  });

  /**
   * Task Groups
   */

  gulp.task('test', ['clean', 'jshint', 'karma']);
  gulp.task('default', ['test', 'build']);
  gulp.task('dist', ['test', 'build']);
})();

