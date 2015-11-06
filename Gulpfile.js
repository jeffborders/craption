var gulp = require('gulp'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	autoPrefixer = require('gulp-autoprefixer'),
	cssLint = require('gulp-csslint'),
	minifyCss = require('gulp-minify-css'),
	webpack = require('gulp-webpack'),
	named = require('vinyl-named'),
	jsHint = require('gulp-jshint'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify');

gulp
	.task('css', function() {
		gulp
			.src('styles/**/*.scss')
			.pipe(sass())
			.pipe(cssLint())
			.pipe(autoPrefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(minifyCss({
				compatibility: 'ie8'
			}))
			.pipe(gulp.dest("dist/css"));
	})
	.task('js', function() {
		gulp
			.src(['lib/**/*.js'])
			.pipe(babel())
			.pipe(jsHint())
			.pipe(named())
			.pipe(webpack())
			.pipe(uglify())
			.pipe(gulp.dest('dist/js'));
	})
	.task('connect', function() {
		connect.server({
			root: [__dirname],
			port: 3636,
			livereload: true,
			middleware: function(connect, opt) {
				return [
					require('./app')
				]
			}
		});
	})
	.task('watch', function() {
		gulp.watch(['styles/**/*.scss'], ['css']);
		gulp.watch(['lib/**/*.js'], ['js']);
	});

// task runners
gulp.task('default', ['build', 'connect', 'watch']);
gulp.task('build', ['css', 'js']);
