$(function(){
  var chatController = new ChatController();
  chatController.init();
});

var ChatController = function() {
  this.chatEvents = _.extend({}, Backbone.Events);
  
  this.init = function() {
    // this.sockChat = new SocketChat({vent: this.chatEvents});
    this.chatView = new ChatView();
  };
  
};