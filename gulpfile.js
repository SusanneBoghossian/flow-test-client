var gulp = require('gulp'),
	babel = require('gulp-babel'),
	server = require('gulp-develop-server');


gulp.task('static-files-0', function() {
	return gulp.src(['src/public/**/*'])
		.pipe(gulp.dest('serve/public'));
});

gulp.task('static-files', ['static-files-0'], function() {
	return gulp.src(['src/**/*.json', 'src/**/*.jade', 'src/public/', 'package.json', 'Procfile','manifest.yml'])
		.pipe(gulp.dest('serve'));
});

gulp.task('scripts', ['static-files'], function() {
	return gulp.src('src/**/*.es6')
		.pipe(babel())
		.pipe(gulp.dest('serve'));
});

gulp.task('server:start', ['scripts'], function() {
	server.listen({
		path: 'serve/keystone.js'
	});
});

gulp.task('server:restart', ['scripts'], function() {
	server.restart();
});

gulp.task('default', ['server:start'], function() {
	gulp.watch(['src/**/*'], ['server:restart']);
});
