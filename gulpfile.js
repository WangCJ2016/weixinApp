var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext'); 
var precss = require('precss');
var templateCache = require('gulp-angular-templatecache'); 
var ngAnnotate = require('gulp-ng-annotate'); 
var useref = require('gulp-useref'); 

var paths = {
  sass: ['./scss/*.scss'],
  templatecache: ['./www/templates/**/*.html', './www/templates/**/**/*.html'],
  ng_annotate: ['./www/js/*.js', './www/templates/**/*.js', './www/templates/**/**/*.js'],
  useref: ['./www/*.html']  
};

gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'useref']);

gulp.task('templatecache', function (done) { 
  gulp.src('./www/templates/**/*.html') 
    .pipe(templateCache({standalone:true, root: "templates"})) 
    .pipe(gulp.dest('./www/js')) 
    .on('end', done); 
}); 

gulp.task('ng_annotate', function (done) { 
  gulp.src(['./www/js/*.js', './www/templates/**/*.js', './www/templates/**/**/*.js']) 
    .pipe(ngAnnotate({single_quotes: true})) 
    .pipe(gulp.dest('./www/dist/dist_js/app')) 
    .on('end', done); 
}); 

gulp.task('useref', function (done) { 
  var assets = useref.assets(); 
  gulp.src('./www/*.html') 
    .pipe(assets) 
    .pipe(assets.restore()) 
    .pipe(useref()) 
    .pipe(gulp.dest('./www/dist')) 
    .on('end', done); 
}); 

gulp.task('sass', function(done) {
  var processors = [autoprefixer({browsers: ['last 2 version']}), cssnext, precss]; 
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss(processors)) 
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(postcss(processors)) 
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.ng_annotate, ['ng_annotate']); 
  gulp.watch(paths.useref, ['useref']); 
});
