var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    pug         = require('gulp-pug'),
    concat      = require('gulp-concat'),
    livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    tinylr      = require('tiny-lr'),
    express     = require('express'),
    app         = express(),
    marked      = require('marked'), // For :markdown filter in pug
    path        = require('path'),
    server      = tinylr();


// --- Basic Tasks ---

gulp.task('css', function() {
  return gulp.src([
                    'src/assets/scss/*.scss',
                    'src/assets/css/*.css',
                    'src/'
                    ])
    .pipe( 
      sass( { 
        includePaths: ['src/assets/scss'],
        errLogToConsole: true
      } ) )
    .pipe( concat('styles.css') )
    .pipe( csso() )
    .pipe( gulp.dest('dist/assets/stylesheets/') )
    .pipe( livereload( server ));
});

gulp.task('js', function() {
  return gulp.src('src/assets/scripts/*.js')
    .pipe( uglify() )
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('dist/assets/scripts/'))
    .pipe( livereload( server ));
});

gulp.task('templates', function() {
  return gulp.src('src/templates/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe( livereload( server ));
});

gulp.task('express', function() {
  app.use(express.static(path.resolve('./dist')));
  app.listen(1337);
  gutil.log('Listening on port: 1337');
});

gulp.task('watch', function () {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }

    gulp.watch('src/assets/scss/*.scss',['css']);

    gulp.watch('src/assets/js/*.js',['js']);

    gulp.watch('src/templates/*.pug',['templates']);
    
  });
});

// Default Task
gulp.task('default', ['js','css','templates','express','watch']);
