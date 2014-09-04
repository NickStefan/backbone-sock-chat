var socket = io();

$(function(){
  
  var username;
  
  $('.messages').css('height',( $(window).height() / 2) );
  $('.chatters').css('height',( $(window).height() / 2) );
  
  $('button').on('click',function(){
    $('form').submit();
  });
  
  $('form').submit(function(e){
    var message = $('#m').val();
    socket.emit('chat message', message);
    $('#m').val('');
    addtoChat({username:username,message:message});
    return false;
  });
  
  socket.on('connect', function(data) {
    username = prompt('Whats your username?');
    socket.emit('add user', username);
  });
  
  socket.on('chat message', function(data){
    addtoChat(data);
  });
  
  // when server says "bob" has login
  // update the chat room stats
  socket.on('login', function(data){
    addtoChatters(data);
  });
  
  // when server says "bob" has joined
  // append to chat
  socket.on('user joined', function(data){
    addtoChat(data);
    addtoChatters(data);
  });


});

var addtoChat = function(data){
  var msg;

  if (data.joined){
    var joined = " has joined the chat.";
    msg = $('<span>').text(data.username + joined).addClass('updated');
    $('.messages').append($('<li>').html(msg));
    
  } else {
    msg = data.username + ": " + data.message;
    $('.messages').append($('<li>').text(msg));
  }
  
  $('.messages').scrollTop( $('.messages')[0].scrollHeight );
};

var addtoChatters = function(data){
  var count = 0;
  $('.chatters').html("");
  for (var key in data.usernames){
    $('.chatters').append($('<li>').text(key));
    count++;
  }
  $('.count').html(count);
  $('.chatters').scrollTop( $('.chatters')[0].scrollHeight );
};