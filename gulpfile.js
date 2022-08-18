"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const pug = require('gulp-pug');

const fs = require('fs');

const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const browserSync = require('browser-sync').create();

const { series, parallel } = gulp

const html = () => {
	return gulp.src('src/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.stream());
}

const styles = () => {
	return  gulp.src("src/styles/*.scss")
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass({
			quietDeps: true
		}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest("build/css"))
		.pipe(browserSync.stream());
}

const images = () => {
	return gulp.src("src/images/**/*.+(png|jpg|gif|svg)")
		.pipe(gulp.dest("build/images/"))
		.pipe(browserSync.stream());
}

const watcher = () => {
	gulp.watch('src/**/*.pug', html)
	gulp.watch('src/styles/**/*.scss', styles)
	gulp.watch('src/images/**/*.*', images)
}


const server = () => {
	browserSync.init({
		server: {
			baseDir: "build/"
		},
		port: 3000,
		open: true
	})
}

exports.dev = series(
	parallel(html, styles, images),
	parallel(watcher, server)
)
