/* Global */
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

/* Errors */
function onError( error ){
  notify.onError( {
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Beep"
  } )( error );
  this.emit('end');
}


/* Copy & Optimize Images */
gulp.task('images', function() {
  return gulp.src('./images/*')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(imagemin({ progressive: true, optimizationLevel: 6 }))
    .pipe(gulp.dest('./images'))
    .pipe(notify({ message: 'Images Optimized & Copied', onLast: true }))
});


/* Compile Less */
gulp.task('less', function() {
  return gulp.src('./src/less/myetherapi-master.less')
    .pipe(plumber({ errorHandler: onError }))
    .pipe( sourcemaps.init() )
    .pipe(less('compress: false'))
    .pipe( autoprefixer({
       browsers: ['last 3 versions', 'iOS > 7'], remove: false
    } ) )
    .pipe(rename('myetherapi-master.css'))
    .pipe(gulp.dest('./css'))
    .pipe( cssnano({
      autoprefixer: false,
      safe: true
    } ) )
    .pipe(rename('myetherapi-master.min.css'))
    .pipe(sourcemaps.write( '../css/maps/' ))
    .pipe(gulp.dest('./css'))
    .pipe(notify('Less Compiled, Prefixed, & Minified'));
});


/* Concat & Uglify JS */
gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
    .pipe(plumber({ errorHandler: onError }))
    .pipe( sourcemaps.init() )
    .pipe(gulpConcat('myetherapi-master.js'))
    .pipe(gulp.dest('./js'))
    .pipe(uglify())
    .pipe(rename('myetherapi-master.min.js'))
    .pipe(sourcemaps.write( '../js/maps/' )       )
    .pipe(gulp.dest('./js'))
    .pipe(notify('JS Concatonated & Uglified'))
});

/* Watch Folders */
var imgWatch      = './images/*';
var lessWatch     = './src/less/**/*.less';
var jsWatch       = './src/js/*.js';

gulp.task('watch', function() {
  gulp.watch(imgWatch, ['images']);
  gulp.watch(lessWatch, ['less']);
  gulp.watch(jsWatch, ['js']);
});

gulp.task('default', ['less', 'js', 'watch']);
gulp.task('build', ['images', 'less', 'js']);
