// import gulp
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});

gulp.task('default', ['browser-sync']);