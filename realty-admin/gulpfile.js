var gulp = require('gulp'),
   jshint = require('gulp-jshint'),
   jscs = require('gulp-jscs'),
   concat = require('gulp-concat'),
   uglify = require('gulp-uglify');

gulp.task('check', function() {
    gulp.src(['resources/assets/js/admin/Main.js', 'resources/assets/js/admin/**/*.js'])
//    .pipe(jshint())
//    .pipe(jshint.reporter('default'))
//    .pipe(jscs())
//    .pipe(jscs.reporter())
    .pipe(concat('admin.js'))
//    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
    
//    gulp.src(['assets/js/login/Main.js', 'assets/js/login/**/*.js'])
//    .pipe(jshint())
//    .pipe(jshint.reporter('default'))
//    .pipe(jscs())
//    .pipe(jscs.reporter())
//    .pipe(concat('login.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function(){
    gulp.watch(['resources/assets/js/admin/Main.js', 'resources/assets/js/admin/directives/*.js', 'resources/assets/js/admin/controllers/*.js'], function () {
        gulp.run('check');
    });
});