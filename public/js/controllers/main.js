$(function(){
  var chatController = new ChatController(); 
});

var ChatController = function() {
  
  this.chatEvents = _.extend({}, Backbone.Events);
  
  this.sockChat = new SockChat({vent: this.chatEvents});
  this.sockChat.connect();
  
  this.chatView = new ChatView({vent: this.chatEvents});
  
  // update list of chatters
  this.chatEvents.on('addtoChatters', function(data) {
    this.chatView.addtoChatters(data);
  }, this);
  
  // update chat list
  this.chatEvents.on('addtoChat', function(data) {
    this.chatView.addtoChat(data);
  }, this);
  
  // client submits chat
  this.chatEvents.on('pushMessage', function(message){
    this.sockChat.chat(message);
  }, this);

};