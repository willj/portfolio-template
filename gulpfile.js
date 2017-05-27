const gulp = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssmin = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const newer = require("gulp-newer");
const concat = require("gulp-concat");
const hbs = require("gulp-compile-handlebars");
const fs = require("fs");

gulp.task("scripts", function(){
	return gulp.src("static_src/script/*.js")
	.pipe(concat('app.js'))
	.pipe(uglify())
	.pipe(rename({extname: ".min.js"}))
	.pipe(gulp.dest("docs/script"));
});

gulp.task("libs", function(){
	return gulp.src("static_src/script/lib/*")
	.pipe(gulp.dest("docs/script"));
});

gulp.task("sass", function(){
	return gulp.src("static_src/**/*.scss")
	.pipe(sass().on('error', sass.logError))
	.pipe(cssmin({compatibility: "ie7", restructuring: false}))
	.pipe(rename({extname: ".min.css"}))
	.pipe(gulp.dest("docs"));
});

gulp.task("styles", function(){
	return gulp.src("static_src/*.css")
	.pipe(cssmin({compatibility: "ie7", restructuring: false}))
	.pipe(rename({extname: ".min.css"}))
	.pipe(gulp.dest("docs"));
});

gulp.task("images", function(){
    return gulp.src("static_src/images/**/*")
    .pipe(newer("static/images"))
	.pipe(imagemin({
		progressive: true,
		use: [pngquant({ quality: '65-80', speed: 4 })]
	}))
	.pipe(gulp.dest("docs/images"));
});

gulp.task("build", function(){
	fs.readFile("./config.json", (err, data) => {
		let config = JSON.parse(data);

		return gulp.src("index.hbs")
		.pipe(hbs(config))
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest("docs/"));
	});
});

gulp.task("watch", function(){
	gulp.watch(["index.hbs","config.json"], ["build"]);
	gulp.watch("static_src/script/*.js", ["scripts"]);
	gulp.watch("static_src/script/lib/*", ["libs"]);
	gulp.watch("static_src/*.css", ["styles"]);
	gulp.watch("static_src/images/**/*", ["images"]);
});

gulp.task("default", ["scripts", "libs", "sass", "styles", "images", "build"]);
