$(function(){
  var chatController = new ChatController(); 
});

var ChatController = function() {
  
  this.chatEvents = _.extend({}, Backbone.Events);
  
  this.sockChat = new SockChat({vent: this.chatEvents});
  this.sockChat.connect();
  
  this.chatModel = new ChatRoomModel({vent: this.chatEvents});
  
  this.chatView = new ChatView({model: this.chatModel, vent: this.chatEvents});
  
  // client submits chat
  this.chatEvents.on('pushMessage', function(data){
    this.sockChat.chat(data);
  }, this);

};