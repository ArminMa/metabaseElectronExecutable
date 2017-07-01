const gulp = require('gulp');
const less = require('gulp-less');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');
const jetpack = require('fs-jetpack');
const path = require("path");
const fs = require("fs");
const request = require("request-promise");
const bundle = require('./bundle');
const utils = require('./utils');


const projectDir = jetpack;
let INIT_HTML_PATH, UBERJAR_PATH;

const destDir = jetpack.cwd('./desktop');

INIT_HTML_PATH = path.join(path.dirname(__dirname), "resources", "frontend_client", "init.html");
UBERJAR_PATH = path.join(path.dirname(__dirname), "target", "uberjar", "metabase.jar");

gulp.task('bundle', () => {

    return Promise.all([
        bundle(path(UBERJAR_PATH), destDir.path('metabase.jar')),
        bundle(path(INIT_HTML_PATH), destDir.path('init.html')),
    ]);
});


gulp.task('environment', () => {
    const configFile = `config/env_${utils.getEnvName()}.json`;
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', () => {
    const beepOnError = (done) => {
        return (err) => {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.js', batch((events, done) => {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.less', batch((events, done) => {
        gulp.start('less', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'less', 'environment']);
