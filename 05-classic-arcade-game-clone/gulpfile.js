// import gulp
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    jslint = require('gulp-jslint'),
    csslint = require('gulp-csslint');

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});


gulp.task('verifyJS', function () {
    return gulp.src(['dist/js/resumeBuilder.js'])
            .pipe(jslint(   ))
            .pipe(jslint.reporter('default'));
});


gulp.task('verifyCSS', function() {
  gulp.src('dist/css/*.css')
    .pipe(csslint())
    .pipe(csslint.formatter()) // display errors
    .pipe(csslint.formatter('fail')); // fail on error
});

gulp.task('verify', ['verifyCSS', 'verifyJS']);
gulp.task('default', ['connect']);