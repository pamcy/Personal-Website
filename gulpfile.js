var gulp = require('gulp'),
    bs = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css');

gulp.task('minify-js', function() {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
})

gulp.task('minify-css', function() {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('main.min.css'))
        .pipe(cleancss())
        .pipe(gulp.dest('dist/css'))
})

gulp.task('minify', ['minify-js', 'minify-css'], function() {
    return gulp.src('src/index.html')
      .pipe(gulp.dest('dist'))
})