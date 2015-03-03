/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var clip = require('gulp-clip-empty-files');

var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/* Handlers */
var onError = function(err) {
	$.notify.onError({
		title:	"Gulp",
		subtitle: "Failure!",
		message:  "Error: <%= error.message %>",
		sound:	"Sosumi"
	})(err);

	this.emit('end');
};

var onHint = function (file) {
	if (!file.jshint.success) {
		var errors = file.jshint.results.map(function (data) {
			if (data.error) {
				return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
			}
		}).join("\n");

		return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
	}
};

/* Compile SASS styles */
gulp.task('styles', function () {
	return gulp.src(['app/css/style.scss'])
		.pipe($.plumber({errorHandler: onError}))
		.pipe(clip())
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe(gulp.dest('dist/css/'))
		.pipe(reload({stream:true}));
});

/* Lint JavaScript */
gulp.task('scripts', function () {
	return gulp.src('app/js/**/*.js')
		.pipe($.plumber({errorHandler: onError}))
		.pipe(clip())
		.pipe($.jshint())
		.pipe($.jshint.reporter(require('jshint-stylish')))
		.pipe($.notify(onHint))
		.pipe(gulp.dest('dist/js/'))
		.pipe(reload({stream:true}));
});

/* Copy HTML */
gulp.task('html', function () {
	return gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(reload({stream:true}));
});

/* Copy Images */
gulp.task('images', function() {
	return gulp.src('app/img/**/*.png')
		.pipe(gulp.dest('dist/img/'))
		.pipe(reload({stream:true}));
});

/* Control tasks */

gulp.task('build', function(cb) {
	runSequence(['html', 'images', 'styles', 'scripts'], cb);
});

gulp.task('default', ['build']);

gulp.task('serve', ['watch'], function () {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		debugInfo: false,
		ghostMode: false
	});
});

gulp.task('watch', ['build'], function (cb) {
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/img/**/*.png', ['images']);
	gulp.watch('app/css/**/*.scss', ['styles']);
	gulp.watch(['../lib.js', 'app/js/**/*.js'], ['scripts']);

	if(argv._[0] == 'serve')
	{
		cb();
	}
});
