var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');

var bundler = watchify(browserify(watchify.args));
bundler.require('./src/chromosome.js',{expose:"Chromosome"});
// add any other browserify options or transforms here
bundler.transform('brfs');

gulp.task('build-watch', bundleDev); // so you can run `gulp js` to build the file

bundler.on('update', bundleDev); // on any dep update, runs the bundler

function bundleDev() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('./build/cyto-chromosome-vis.js'))
        //
        .pipe(gulp.dest('./dist'));
}

gulp.task('build', function() {
    var b = browserify();
    b.add('./src/index.js')
    .require('./src/chromosome.js', {expose:"cyto-chromosome-vis"})
        .bundle()
    .pipe(source('./build/cyto-chromosome.js'))
    .pipe(gulp.dest('./dist'));

});

gulp.task('compress', function() {
    gulp.src('dist/build/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/release'));
});