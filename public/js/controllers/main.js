$(function(){
  var chatController = new ChatController(); 
});

var ChatController = function() {
  
  this.chatEvents = _.extend({}, Backbone.Events);
  
  this.chatView = new ChatView({vent: this.chatEvents});
  this.sockChat = new SockChat(this.chatView);
  
  this.chatEvents.on('pushMessage', function(message){
    this.sockChat.chat(message);
  }, this);

};