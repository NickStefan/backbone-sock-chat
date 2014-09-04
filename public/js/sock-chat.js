var socket = io();

$(function(){
  
  $('.messages').css('height',( $(window).height() / 2) );
  
  $('button').on('click',function(){
    $('form').submit();
  });
  
  $('form').submit(function(e){

    socket.emit('chat message', $('#m').val());

    $('#m').val('');

    return false;
  });
  
  socket.on('connect', function(data) {
    username = prompt('Whats your username?');
    socket.emit('join', username);
  });
  
  socket.on('chat message', function(msg){
    addtoChat(username);
  });

});

var addtoChat = function(msg){
  $('.messages').append($('<li>').text(msg));
  $('.messages').scrollTop( $('.messages')[0].scrollHeight );
};