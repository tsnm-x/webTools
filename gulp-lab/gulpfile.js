const gulp = require("gulp");
const {src, dest, parallel, watch, series} = require("gulp");
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const inject = require("gulp-inject")

const globe = {
    html:"project/*.html",
    js: "project/js/**/*.js",
    css: "project/css/**/*.css",
    img: "project/pics/*",
}


function htmlTask(){
    return src(globe.html, {sourcemaps:true})
    .pipe(inject(src(["dist/assets/css/*.css", "dist/assets/js/*.js"]), {ignorePath:'dist'}))
    .pipe(htmlmin({collapseWhitespace:true, removeComments:true}))
    .pipe(dest("dist"));
}

function jsTask(){
    return src(globe.js, {sourcemaps:true})
    .pipe(concat("all.min.js"))
    .pipe(terser())
    .pipe(dest("dist/assets/js"))
}

function cssTask(){
    return src(globe.css, {sourcemaps:true})
    .pipe(concat("style.min.css"))
    .pipe(cleanCss())
    .pipe(dest("dist/assets/css"))
}

function imgTask(){
    return src(globe.img)
    .pipe(imagemin())
    .pipe(dest("dist/images"));
}

function serve(nxt){
    browserSync({
        server:{
            baseDir: "dist/"
        }
    });
    nxt();
}

function reload(nxt){
    browserSync.reload();
    nxt()
}

function watchTask(){
    watch(globe.html, series(htmlTask, reload));
    watch(globe.css, series(cssTask, reload));
    watch(globe.js, series(jsTask, reload));

}

exports.default = series(parallel(jsTask, cssTask, imgTask), htmlTask, serve, watchTask)