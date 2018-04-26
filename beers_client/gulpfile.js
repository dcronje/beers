let gulp = require('gulp')
let runSequence = require('run-sequence')
let { spawn, exec } = require('child_process')
var api

gulp.task('server-dev', (cb) => {
  runSequence('server-transpile', 'server-start', cb)
})

gulp.task('server-start', () => {
  if (api) api.kill()
  api = spawn('node', ['./index.js'], {stdio: 'inherit'})
  api.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...')
    }
  })
})

gulp.task('server-transpile', (cb) => {
  exec('BABEL_ENV=server babel ./src -d ./build', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
    }
    console.log(stdout)
    cb()
  })
})

gulp.task('watch', ['server-dev'], () => {
  gulp.watch(['./src/**/*.js', '!./public/*', '!./public/**'], ['server-dev'])
  gulp.watch('./src/*.js', ['server-dev'])
  gulp.watch('./.env', ['server-dev'])
})
