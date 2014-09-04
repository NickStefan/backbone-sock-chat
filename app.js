var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dust = require('dustjs-linkedin');
var cons = require('consolidate');

var app = express();

// routes and templating
var routes = require('./routes/index');
var users = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');
app.engine('dust', cons.dust);

// middleware
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      console.log(err.toString());
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// originally from bin/www file
//http://stackoverflow.com/questions/24222483/socket-io-1-0-express-4-2-no-socket-connection

var debug = require('debug')('generated-express-app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});

// * end bin/www functions

// socket io
var io = require('socket.io').listen(server);

var usernames = {};

io.on('connection', function (socket) {
  console.log('another user has connected...');
  
  socket.on('add user', function(username){
    socket.username = username;
    usernames[username] = username;

    socket.emit('login', {
      usernames: usernames
    });
    
    socket.broadcast.emit('user joined', {
      usernames: usernames,
      username: socket.username,
      joined: true
    });
  });
  
  socket.on('chat message', function(msg){

    socket.broadcast.emit('chat message', {
      username: socket.username,
      message: msg
    });
  });
  
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
    
});

module.exports = app;
