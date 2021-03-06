var createError = require('http-errors');
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose')
const dotenv = require('dotenv').config()
var Grid = require('gridfs-stream');
const connection = require('./src/utils/mongo-db/mongo-db')
const corsOptions = {
  exposedHeaders: 'x-access-token',
};
connection.once('open', async () => {
  console.log('db is connected');
});
var app = express();
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json({limit:"100mb", extended: true}));
app.use(express.urlencoded({limit:"100mb",extended:true}));
app.use(express.static('public'));
app.use(express.static(__dirname + '/img/'));
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');
app.use('/api/v1/users',require('./src/routes/users'));
app.use('/api/v1/requests',require('./src/routes/requests'));
app.get('/', (req, res) => {  
  res.sendFile(__dirname + '/index.html');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
