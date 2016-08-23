var gulp = require('gulp'),
	ts = require('gulp-typescript'),
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
	return gulp.src('src/**/*.ts')//old es6
		.pipe(ts())
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
