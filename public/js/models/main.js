var ChatModel = Backbone.Model.extend({});
var UserModel = Backbone.Model.extend({});

var UserCollection = Backbone.Collection.extend({
  model: UserModel
});

var ChatCollection = Backbone.Collection.extend({
  model: ChatModel
});

var ChatRoomModel = Backbone.Model.extend({
  defaults: {
    onlineUsers: new UserCollection(),
    userChats: new ChatCollection()
  },

  initialize: function(options) {
    this.vent = options.vent;

    this.vent.on('connect', function(username) {
      this.set('username', username);
      this.get('userChats').add(
        { sender: username, message: '...connecting to chat server...', PSA:true }
      );
    }, this);

    this.vent.on('login', function(data) {
      this.get('userChats').add(
        { sender: data.username, message: 'has joined the chat', PSA:true }
      );
      this.createChattersList(data);
    }, this);

    this.vent.on('userJoined', function(data) {
      this.get('onlineUsers').add(new UserModel({ name: data.username }));
      this.get('userChats').add(
        { sender: data.username, message: 'has joined the chat', PSA:true }
      );
    }, this);

    this.vent.on('addtoChat', function(data) {
      if (data.userleft) {
        this.removeUser(data);
        this.get('userChats').add(
          { sender: data.username, message: 'has left the chat', PSA:true }
        );
      } else {
        this.addChat(data);
      }
    }, this);

    this.vent.on('removeUser', function(data) {
      this.removeUser(data);
    },this);

  },
  
  createChattersList: function(data) {
    if (data.username === this.get('username')) {
      for (var key in data.usernames) {
        if (data.usernames.hasOwnProperty(key)) {
          this.get('onlineUsers').add(new UserModel({ name: data.usernames[key] }));
        }
      }
    }
  },
  
  removeUser: function(data) {
    var onlineUsers = this.get('onlineUsers');
    
    var u = onlineUsers.find(function(item) {
      return item.get('name') === data.username;
    });
    
    if (u) {
      onlineUsers.remove(u);
    }
  },
  
  addChat: function(data) {
    console.log(data);
    this.get('userChats').add(new ChatModel(
      { sender: data.sender, message: data.message }
    ));
  }
  
});