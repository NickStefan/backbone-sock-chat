var socket = io();

$(function(){
  
  $('form').submit(function(e){

    socket.emit('chat message', $('#m').val());

    $('#m').val('');

    return false;
  });
  
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

});
