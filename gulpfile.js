var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css');

gulp.task('minify-js', function() {
    return gulp.src('assets/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
})

gulp.task('minify-css', function() {
    return gulp.src('assets/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('main.min.css'))
        .pipe(cleancss())
        .pipe(gulp.dest('assets/css'));
})

gulp.task('default', ['minify-js', 'minify-css']);