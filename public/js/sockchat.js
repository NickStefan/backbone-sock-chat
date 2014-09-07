
var username = prompt('Whats your username?');

var SockChat = function(view){
  
  var socket = io();
  
  this.chat = function(message) {
    socket.emit('chat message', message);
  };
  
  socket.on('connect', function(data) {
    socket.emit('add user', username);
  });
  
  socket.on('chat message', function(data){
    view.addtoChat(data);
  });
  
  // when server says you have logged in
  // update the chat room stats
  socket.on('login', function(data){
    view.addtoChatters(data);
  });
  
  // when server says other guy has joined
  // append to chat
  socket.on('user joined', function(data){
    view.addtoChat(data);
    view.addtoChatters(data);
  });
  
  socket.on('user left', function(data){
    view.addtoChat(data);
    view.addtoChatters(data);
  });
};
