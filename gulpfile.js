var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

var babel = require('gulp-babel');

var vendorPaths = require('./gulpTasks/vendorPaths');
var clientPaths = require('./gulpTasks/clientPaths');


gulp.task('buildVendors', function () {
  return gulp.src(vendorPaths)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('buildJs', function () {
  return gulp.src(clientPaths)
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('watch', function () {
  gulp.watch('./public/js/**/*.js', ['buildJs']);
});

gulp.task('default', ['buildVendors', 'buildJs', 'watch']);