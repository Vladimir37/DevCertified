var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var shell = require('gulp-shell');

const root_dir = __dirname;
const client_js = path.join(root_dir, 'client/source/scripts');
const client_css = path.join(root_dir, 'client/source/styles');
const build_dir = path.join(root_dir, 'client/source/build');


gulp.task('build-js', () => {
    return gulp.src(client_js)
    .pipe(shell('cd ' + client_js + ' && webpack'));
});

gulp.task('watch-js', () => {
    return gulp.src(client_js)
        .pipe(shell('cd ' + client_js + ' && webpack --watch'));
});

gulp.task('build-css', () => {
    return gulp.src([
        client_css + '/main.less'
    ])
    .pipe(less())
    .pipe(gulp.dest(build_dir));
});
