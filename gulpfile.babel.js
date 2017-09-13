'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import {exec} from 'child_process';

const loc = 'node_modules/';
const staticPath = 'static/';
const publicPath = 'public/';
const reload = browserSync.reload;

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

/* Main development server command */
/* Checks --env and sets browserSync settings. */
/* Runs other gulp tasks to minifi CSS and JS files. */
/* Moves font-awesome webfonts files to static. */
/* Runs the Watched Task. */
/* Starts the Django dev server. */
/* BrowserSync loads hot-reload. */
gulp.task('runserver',['webserver'], function () {
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
