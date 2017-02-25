// variables
var gulp      = require('gulp');
var ngrok     = require('ngrok');
var psi       = require('psi');
var sequence  = require('run-sequence');
var site      = '';
var portVal   = 3020;
var browserSync = require('browser-sync');

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(portVal, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-desktop', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'desktop'
  }, cb);
});

gulp.task('psi-mobile', function (cb) {
  psi(site, {
    nokey: 'true',
    strategy: 'mobile'
  }, cb);
});

gulp.task('test-psi', function (cb) {
  return sequence(
    'serve',
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});

// Build and serve the output from the dist build
gulp.task('serve', function() {
  browserSync({
    port: portVal,
    notify: false,
    server: 'app',
    baseDir: 'app',
    open: false,
  });
});