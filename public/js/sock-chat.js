var socket = io();
var username = prompt('Whats your username?');

$(function(){
  
  var chatView = new ChatView();
  
  socket.on('connect', function(data) {
    socket.emit('add user', username);
  });
  
  socket.on('chat message', function(data){
    chatView.addtoChat(data);
  });
  
  // when server says you have logged in
  // update the chat room stats
  socket.on('login', function(data){
    chatView.addtoChatters(data);
  });
  
  // when server says other guy has joined
  // append to chat
  socket.on('user joined', function(data){
    //chatView.vent.trigger('addtoChat', data);
    chatView.addtoChat(data);
    chatView.addtoChatters(data);
  });
  
  socket.on('user left', function(data){
    chatView.addtoChat(data);
    chatView.addtoChatters(data);
  });


});