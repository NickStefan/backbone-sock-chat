
var username = prompt('Whats your username?');

var SockChat = function(options){
  
  var self = this;
  
  self.vent = options.vent;
  
  this.connect = function() {
    this.socket = io();
    
    this.sockListeners(this.socket);

  };
  
  this.chat = function(data) {
    this.socket.emit('chatMessage', data);
  };
  
  
  this.sockListeners = function(socket) {
    
    // when this client connects, attempt
    // to log in to the server's chat
    socket.on('connect', function(data) {
      socket.emit('addUser', username);
      self.vent.trigger('connect', username);
    });
    
    // when server says this client has logged in
    // update the chat room stats
    socket.on('login', function(data){
      self.vent.trigger("login",data);
    });
    
    // when server says other client has joined
    // append to client's chat
    socket.on('userJoined', function(data){
      self.vent.trigger("userJoined",data);
    });
    
    // when server says other client has chatted
    // update chat messages
    socket.on('chatMessage', function(data){
      self.vent.trigger("addtoChat",data);
    });
  
    // when other client logs out
    socket.on('userLeft', function(data){
      self.vent.trigger("removeUser",data);
      self.vent.trigger("addtoChat",data);
    });
    
  };
};
