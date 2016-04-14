var gulp           = require('gulp'),
    browserify     = require('browserify'),
    source         = require('vinyl-source-stream'),
    uglify         = require('gulp-uglify'),
    rename         = require('gulp-rename'),
    concat         = require('gulp-concat'),
    jshint         = require('gulp-jshint');


gulp.task('scripts', function() {
  return  gulp.src(['src/*.js', '!src/pixi.min.js'])
          .pipe(jshint())
          .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('build', function() {
  return  browserify('src/app.js')
          .bundle()
          .pipe(source('build.js'))
          .pipe(gulp.dest('build'));
})

gulp.task('uglify', function(){
  return  gulp.src(['src/build/bundle.js'])
          .pipe(uglify())
          .pipe(gulp.dest('src/build/'));
})


gulp.task('default', ['scripts', 'build'], function(){
  gulp.watch('src/*.js', ['scripts', 'build']);
})
