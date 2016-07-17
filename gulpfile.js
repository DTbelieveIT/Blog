var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('browser-sync', function() {
  browserSync({
    files: "**",
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('start', function() {
  nodemon({
    script: 'app.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  })
})

gulp.task('default', ["start"]);
