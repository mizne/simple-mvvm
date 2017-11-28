/*
 * @Author: mizne 
 * @Date: 2017-11-26 01:51:49 
 * @Last Modified by: mizne
 * @Last Modified time: 2017-11-26 01:54:27
 */

const gulp = require('gulp')
const git = require('gulp-git')
var runSequence = require('run-sequence');
var minimist = require('minimist');
var knownOptions = {
  string: 'msg',
  default: {
    msg: 'update'
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('commit-changes', function () {
  return gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit(options.msg))
})


gulp.task('push-changes', function (cb) {
  git.push('origin', 'master', cb)
})

gulp.task('git-push', function (cb) {
  runSequence(
    'commit-changes',
    'push-changes',
    function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log('GIT PUSH SUCCESSFULLY');
      }
      cb(error);
    });
})