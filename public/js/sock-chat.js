var socket = io();

$(function(){
  
  var username;
  
  $('.messages').css('height',( $(window).height() / 2) );
  
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
  
  socket.on('login', function(){
    
  });
  
  socket.on('user joined', function(){
    
  });


});

var addtoChat = function(data){
  var msg;
  if (data.username){
    msg = data.username + ": " + data.message;
  } else {
    msg = '<span class="update">' + data.message + "</span>";
  }
  $('.messages').append($('<li>').text(msg));
  $('.messages').scrollTop( $('.messages')[0].scrollHeight );
};