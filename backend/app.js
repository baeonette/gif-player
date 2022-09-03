var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var logready = require('logready');
var cors = require('cors');
var fs = require('fs');

var indexRouter = require('./routes/index');
var ftpRouter = require('./routes/ftp');
const { exec } = require('child_process');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());

app.use(logger('dev'));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/storage', express.static(path.join('media/storage')));
app.use('/api/playing', express.static(path.join('media/playing')));
app.use('/', indexRouter);
app.use('/api/ftp', ftpRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var gifs = fs.readdirSync('./media/storage');
gifs.shift() // Remove ".storage"
var gif = gifs[0];

// exec('bash ./run.sh ' + gif);

logready('Backend');

module.exports = app;
