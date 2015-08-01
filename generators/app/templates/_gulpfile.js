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
        rename = require('gulp-rename'),
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

    gulp.task('compress', function () {
        return gulp.src(jsDir + '/app.js')
            .pipe(uglify({
                preserveComments: 'some'
            }))
            .pipe(rename({
                extname: '.min.js'
            }))
            .pipe(gulp.dest(jsDir));
    });

    // Keep an eye on Less
    gulp.task('watch', function () {
        gulp.watch(targetLESSDir + '/**/*.less', ['css']);
    });

    // What tasks does running gulp trigger?
    gulp.task('default', ['css', 'watch']);
}());
