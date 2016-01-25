var gulp = require('gulp'),
	babel = require('gulp-babel'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del');

    gulp.task('clean-temp', function(){
	  	return del(['dest']);
	});

	gulp.task('es6-commonjs',['clean-temp'], function(){
	  	return gulp.src(['src/*.js','src/**/*.js'])
	    .pipe(babel({presets: 'es2015'}))
	    .pipe(gulp.dest('dest/temp'));
	});

	gulp.task('bundle-commonjs-clean', function(){
	  	return del(['build']);
	});

	gulp.task('commonjs-bundle',['bundle-commonjs-clean','es6-commonjs'], function(){
	  	return browserify(['dest/temp/caveman.js']).bundle()
	    .pipe(source('caveman.js'))
	    .pipe(buffer())
	    .pipe(uglify())
	    .pipe(rename('caveman.js'))
	    .pipe(gulp.dest("build"));
	});

	gulp.task('default', ['commonjs'], function(){
	  	return del(['dest']);
	});

	gulp.task('commonjs', ['commonjs-bundle']);