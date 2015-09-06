/**
 * Project : <%= app_name %>
 * File : gulpfile
 */

/*jslint indent: 4, maxlen: 100, node: true, vars: true, nomen: true */

(function () {
    'use strict';

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        less = require('gulp-less'),
        plumber = require('gulp-plumber'),
        uglify = require('gulp-uglify'),
        minifyCSS = require('gulp-minify-css'),
        rename = require('gulp-rename'),
        browserSync = require('browser-sync'),
        sourcemaps = require('gulp-sourcemaps'),
        targetCSSDir = 'css',
        targetLESSDir = 'less',
        jsDir = 'js';

    // Compile Less
    // and save to target CSS directory
    gulp.task('css', function () {
        return gulp.src(targetLESSDir + '/app.less')
            .pipe(plumber())
            .pipe(less({style: 'compressed'})
                .on('error', gutil.log))
            .pipe(gulp.dest(targetCSSDir));
    });

    gulp.task('compress-css', function () {
        return gulp.src(targetLESSDir + '/app.less')
            .pipe(plumber())
            .pipe(less({style: 'compressed'})
                .on('error', gutil.log))
            .pipe(sourcemaps.init())
            .pipe(minifyCSS({compatibility: 'ie8'}))
            .pipe(sourcemaps.write())
            .pipe(rename({
                extname: '.min.css'
            }))
            .pipe(gulp.dest(targetCSSDir));
    });

    gulp.task('compress-js', function () {
        return gulp.src(jsDir + '/app.js')
            .pipe(uglify({
                preserveComments: 'some'
            }))
            .pipe(rename({
                extname: '.min.js'
            }))
            .pipe(gulp.dest(jsDir));
    });

    gulp.task('serve', ['css', 'compress-js'], function () {
        browserSync.init({
            open: false,
            server: {
                baseDir: './'
            }
        });

        gulp.watch(jsDir + '/app.js', ['compress-js']);
        gulp.watch(targetLESSDir + '/**/*.less', ['css', 'compress-css']);
        gulp.watch(['*.html', targetLESSDir + '/**/*.less', jsDir + '/app.js'])
            .on('change', browserSync.reload);
    });

    // What tasks does running gulp trigger?
    gulp.task('default', ['css', 'serve']);

    gulp.task('compress-css', ['compress-css']);
    gulp.task('compress-js', ['compress-js']);
    gulp.task('compress', ['compress-js', 'compress-css']);
}());
