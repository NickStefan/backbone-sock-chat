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
  
  socket.on('chat message', function(msg){
    $('.messages').append($('<li>').text(msg));
    $('.messages').scrollTop( $('.messages')[0].scrollHeight );
  });

});
