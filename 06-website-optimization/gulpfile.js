var gulp        = require('gulp');
var port        = 3020;
var browserSync = require('browser-sync');

gulp.task('serve', function() {
  browserSync({
    port: port,
    notify: false,
    server: 'dist',
    baseDir: 'dist',
    open: false,
  });
});