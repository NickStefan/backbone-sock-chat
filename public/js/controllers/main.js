$(function(){
  var chatController = new ChatController(); 
});

var ChatController = function() {
  
  this.chatEvents = _.extend({}, Backbone.Events);
  
  this.sockChat = new SockChat({vent: this.chatEvents});
  this.sockChat.connect();
  
  this.chatModel = new ChatRoomModel({vent: this.chatEvents});
  
  this.chatView = new ChatView({model: this.chatModel, vent: this.chatEvents});
  
  // update list of chatters
  // this.chatEvents.on('addtoChatters', function(data) {
  //   //this.chatView.addtoChatters(data);
  //   // should add to models, have views watching the models!!!!
  //   this.chatModel.addUser(data.username);
  // }, this);
  
  // update chat list
  // this.chatEvents.on('addtoChat', function(data) {
  //   //this.chatView.addtoChat(data);
  //   // should add to models, have views watching the models!!!!
  //   this.chatModel.addChat({sender: data.message, message: data.message});
  // }, this);
  
  // client submits chat
  this.chatEvents.on('pushMessage', function(message){
    this.sockChat.chat(message);
    // leave this out of the models
  }, this);

};