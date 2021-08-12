const gulp = require ('gulp');
const { series, parallel } = require ('gulp');
const pug = require ('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

const html = function(){
  return gulp.src('pug/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('build'))
}

const styles = function(){
  return gulp.src('style/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(cssnano())
  .pipe(rename({ suffix: '.min'}))
  .pipe(gulp.dest('build/css'))
}

const images = function(){
  return gulp.src('images/*.*')
  .pipe(imagemin())
  .pipe(gulp.dest('build/images'))
}

const server = function(){
  browserSync.init({
    server:{
      baseDir:'./build'
    },
    notify: false
  })
  browserSync.watch('build',browserSync.reload)
}

const deleteBuild = function(cb){
return del('build/**/*.*').then(() => { cb () })
}

const watch = function(){
  gulp.watch('lpug/**/*.pug', html)
  gulp.watch('style/**/*.scss', styles)
  gulp.watch('images/**/*.*', images)
}
exports.default = series(
  deleteBuild,
  parallel(html,styles,images),
  parallel(watch,server)
)