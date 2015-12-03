var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cssLint = require('gulp-csslint');
var minifyCss = require('gulp-minify-css');
var webpack = require('gulp-webpack');
var named = require('vinyl-named');
var jsHint = require('gulp-jshint');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

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
