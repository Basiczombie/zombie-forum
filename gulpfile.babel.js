'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import cleancss from 'gulp-clean-css';
import fsCache from 'gulp-fs-cache';
import watch from 'gulp-watch';
import {exec} from 'child_process';

const loc = 'node_modules/';
const staticPath = 'static/';
const reload = browserSync.reload;

/* Compiles JavaScript. */
/* JS is concatenated and minified. */
/* A cache file is create. */
/* Minified JS is outputed. */
gulp.task('scripts', function () {
    let jsFsCache = fsCache('static/.tmp/jscache');
    return gulp.src([
        `${loc}jquery/dist/jquery.js`,
        `${loc}materialize-css/dist/js/materialize.min.js`,
        `${loc}markdown/lib/markdown.js`,
        `${loc}masonry-layout/dist/masonry.pkgd.js`,
        `${loc}isotope-layout/dist/isotope.pkgd.js`,
        `${loc}jquery-backstretch/jquery.backstretch.js`,
        `${loc}jquery-match-height/dist/jquery.matchHeight.js`,
        `${loc}nanogallery2/dist/jquery.nanogallery2.js`,
        `${loc}infinite-scroll/dist/infinite-scroll.pkgd.js`,
        `${loc}ua-parser-js/dist/ua-parser.min.js`,
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.stream());
});

/* Compiles Vendor Css Files. */
/* CSS is concatenated and minified. */
/* A cache file is create. */
/* Minified CSS is outputed. */
gulp.task('vendor', function () {
    let cssFsCache = fsCache('static/.tmp/csscache');
    return gulp.src([
        `${loc}animate.css/animate.css`,
        `${loc}nanogallery1/dist/css/nanogallery1.min.css`
    ])
        .pipe(concat('vendor.min.css'))
        .pipe(cssFsCache)
        .pipe(cleancss())
        .pipe(cssFsCache.restore)
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

/* The Sass data is concatenated and minified then outputed. */
gulp.task('scss', function () {
    return gulp.src([
        `${loc}materialize-css/sass/materialize.scss`,
        'static/scss/*.scss'
    ])
        .pipe(sass())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', ['webserver'], function () {
    /* Trigger a reload on a scss file change */
    gulp.watch('static/scss/*.scss', ['scss']).on('change', reload);
});

/* Main development server command */
/* Checks --env and sets browserSync settings. */
/* Runs other gulp tasks to minifi CSS and JS files. */
/* Moves font-awesome webfonts files to static. */
/* Runs the Watched Task. */
/* Starts the Django dev server. */
/* BrowserSync loads hot-reload. */

gulp.task('webserver', function () {
      let dev = '--settings=core.settings.development';
      let serverUrl;
      serverUrl = "0:8000";
      var proc = exec(`python manage.py runserver_plus ${serverUrl} ${dev}`);
      proc.stderr.on('data', function (data) {
          process.stdout.write(data);
      });

      proc.stdout.on('data', function (data) {
          process.stdout.write(data);
      });
});

gulp.task('runserver',['webserver','watch','scripts','scss','vendor'], function () {
    let syncConfig;
      syncConfig = {
          proxy: "127.0.0.1:8000",
          port: 8080,
          reloadDelay: 1000,
          reloadDebounce: 2000,
          reloadOnRestart: true,
          open: false
      };
    browserSync.init(null, syncConfig);
});
