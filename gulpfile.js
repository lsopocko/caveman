var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    del = require('del');


	gulp.task('uglify',['clean'], function(){
	  	return gulp.src(['src/*.js','src/**/*.js'])
	    .pipe(uglify())
	    .pipe(gulp.dest('build'));
	});

	gulp.task('clean', function(){
	  	return del(['dest']);
	});

	gulp.task('watch', function() {
		gulp.watch(['src/*.js','src/**/*.js'], ['uglify']);
 	});

	gulp.task('default', ['watch']);
