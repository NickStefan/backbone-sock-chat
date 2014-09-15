
var username = prompt('Whats your username?');

var SockChat = function(options){
  
  var self = this;
  
  self.vent = options.vent;
  
  this.connect = function() {
    this.socket = io();
    
    this.sockListeners(this.socket);

  };
  
  this.chat = function(message) {
    this.socket.emit('chatMessage', message);
  };
  
  
  this.sockListeners = function(socket) {
    
    // when this client connects, attempt
    // to log in to the server's chat
    socket.on('connect', function(data) {
      socket.emit('addUser', username);
    });
    
    // when server says this client has logged in
    // update the chat room stats
    socket.on('login', function(data){
      self.vent.trigger("addtoChatters",data);
    });
    
    // when server says other client has joined
    // append to client's chat
    socket.on('userJoined', function(data){
      self.vent.trigger("addtoChatters",data);
      self.vent.trigger("addtoChat",data);
    });
    
    // when server says other client has chatted
    // update chat messages
    socket.on('chatMessage', function(data){
      self.vent.trigger("addtoChat",data);
    });
  
    // when other client logs out
    socket.on('userLeft', function(data){
      self.vent.trigger("addtoChatters",data);
      self.vent.trigger("addtoChat",data);
    });
    
  };
};
