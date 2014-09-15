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
var clients = [];

io.on('connection', function (socket) {
  var success = false;
  console.log('user attempting to connect...');
  
  socket.on('addUser', function(username){
    socket.username = username;
    clients.push(socket);
    usernames[username] = clients.length - 1;
    success = true;
    console.log(username + " has successfully connected.");
    
    socket.emit('login', {
      usernames: usernames
    });
    
    socket.broadcast.emit('userJoined', {
      usernames: usernames,
      username: socket.username,
      joined: true
    });
    
  });
  
  socket.on('chatMessage', function(msg){

    socket.broadcast.emit('chatMessage', {
      username: socket.username,
      message: msg
    });
  });
  
  socket.on('disconnect', function(){
    
    // if user had previously connected succesfully
    if (success) {
      delete usernames[socket.username];
      console.log(socket.username + ' has disconnected.');
      
      socket.broadcast.emit('userLeft', {
        left: true,
        username: socket.username,
        usernames: usernames
      });
    } 
  });
  
  // TODO proof of concept sending direct messages
  // setInterval(function() {
//       if (clients.length > 0) {
//         var user = "ck";
//         var sender = socket.username;
//         console.log(sender);
//         console.log(socket.username);
//         clients[usernames[user]].emit('chat message', {
//           username: sender,
//           message: "this is only for you " + user
//         });
//       }
//   }, 10000);
  
});

module.exports = app;
