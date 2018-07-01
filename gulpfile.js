const gulp = require("gulp");
const source = require("vinyl-source-stream");
const browserify = require("browserify");
const version = require("./package.json").version;

gulp.task("watch", function() {
  gulp.watch(["src/**/*.js"], gulp.series("dev"));
});

gulp.task("dev", function() {
  return browserify({
    entries: "./src/main.js",
    debug: true
  })
    .bundle()
    .pipe(source("TyriaExplorer-dev.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("prod", function() {
  return browserify({
    entries: "./src/main.js",
    debug: false
  })
    .bundle()
    .pipe(source("TyriaExplorer-" + version + ".js"))
    .pipe(gulp.dest("./dist"));
});
