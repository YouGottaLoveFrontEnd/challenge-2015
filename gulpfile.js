var path = require('path'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

var libs = [
    'bower_components/EaselJS/lib/easeljs-0.8.0.min.js',
    'bower_components/TweenJS/lib/tweenjs-0.6.0.min.js',
    'bower_components/EaselJS/lib/movieclip-0.8.0.min.js',
    'bower_components/webfontloader/webfontloader.js',
    'bower_components/shake.js/shake.js'
];

gulp.task('js:lib', function() {
    gulp.src(libs)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./public'));
});

gulp.task('js', function() {
    return gulp.src(['./public/src/*'])
        .pipe(concat('yglf.js'))
        .pipe(gulp.dest('./public'))
        .pipe(livereload());
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./public/src/*', ['js']);
});

// SERVER
gulp.task('server', function() {
    nodemon({
            script: 'server.js'
        })
        .on('change', [])
        .on('restart', function() {
            console.log('restarted!');
        });
});

gulp.task('default', ['js:lib', 'js', 'server', 'watch']);
