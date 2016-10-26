var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  babel = require('gulp-babel');

// DIST任务
gulp.task('default', function() {
  gulp.src(['src/index.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});
