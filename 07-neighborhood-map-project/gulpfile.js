var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('watch', function(){
  gulp.watch(['./app/index.html'], ['reload']);
});

gulp.task('reload', function(){
  gulp.src('./app/**/*.*')
  .pipe(connect.reload());
});

gulp.task('openApp', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:8080'}));
});

gulp.task('default', ['watch','connect', 'openApp']);