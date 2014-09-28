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
      this.get('userChats').add({ sender: username, message: '...connecting to server...' });
    }, this)

    this.vent.on('login', function(data) {
      this.get('userChats').add({ sender: this.get('username'), message: '...connected to server...' });
      this.createChattersList(data);
    }, this);

    this.vent.on('addtoChat', function(data) {
      this.addChat({sender: data.message, message: data.message});
    }, this);

  },
  
  createChattersList: function(data) {
    if (data.username === this.get('username')) {
      for (var key in data.usernames) {
        if (data.usernames.hasOwnProperty(key)) {
          this.get('onlineUsers').add(new UserModel({ name: data.usernames[key] }));
        }
      }
    }
    //console.log("onlineUsers", this.get('onlineUsers'));
  },
  
  removeUser: function(username) {
    var onlineUsers = this.get('onlineUsers');
    
    var u = onlineUsers.find(function(item) {
      return item.get('name') === username;
    });
    
    if (u) {
      onlineUsers.remove(u);
    }
  },
  
  addChat: function(chat) {
    this.get('userChats').add(new ChatModel(
      { sender: chat.sender, message: chat.message }
    ));
  }
  
});