var gulp = require('gulp');
var ts = require('gulp-typescript');
var https = require('https');
var fs = require('fs');
var secrets = require('./secrets.js')

gulp.task('compile', function () {
	var tsResult = gulp.src('src/**/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			out: 'main.js'
		}));
	return tsResult.js.pipe(gulp.dest('dist'));
});
gulp.task('upload-sim', function () {
	console.log(secrets);
	var email = secrets.email,
		password = secrets.password,
		data = {
			branch: 'dev',
			modules: { main: fs.readFileSync('./dist/main.js', {encoding: "utf8"}) }
		};
	console.log(data);
	var req = https.request({
		hostname: 'screeps.com',
		port: 443,
		path: '/api/user/code',
		method: 'POST',
		auth: email + ':' + password,
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		}
	}, function(res) {
		console.log(res.headers);
		console.log(res.statusCode + res.statusMessage);
	});
	req.write(JSON.stringify(data));
	req.end();
})
gulp.task('build', ['compile', 'upload-sim']);