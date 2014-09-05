var ChatView = Backbone.View.extend({
  el: '#app',
  
  events: {
    'click .send-btn': 'msgSubmit',
    'submit .send-form': 'msgSubmit'
  },
  
  initialize: function() {
    this.render();
  },
  
  template: _.template( $('#main').html()),
  
  render: function() {
    var attributes;
    this.$el.html(this.template(attributes));
    this.afterRender();
  },
  
  afterRender: function() {
    this.$('.messages').css('height',( $(window).height() / 2) );
    this.$('.chatters').css('height',( $(window).height() / 2) );
  },
  
  msgSubmit: function(e) {
    var message = this.$('#m').val();
    socket.emit('chat message', message);
    this.$('#m').val('');
    this.addtoChat({username:username,message:message});
    return false;
  },
  
  addtoChat: function(data) {
    var msg;

    if (data.joined){
      var joined = " has joined the chat.";
      msg = $('<span>').text(data.username + joined).addClass('updated');
      this.$('.messages').append($('<li>').html(msg));
    } else if (data.left){
      var left = " has left the chat.";
      msg = $('<span>').text(data.username + left).addClass('updated');
      this.$('.messages').append($('<li>').html(msg));
    } else {
      msg = data.username + ": " + data.message;
      this.$('.messages').append($('<li>').text(msg));
    }

    this.$('.messages').scrollTop( $('.messages')[0].scrollHeight );
  },
  
  addtoChatters: function(data) {
    var count = 0;
    this.$('.chatters').html("");
    for (var key in data.usernames){
      this.$('.chatters').append($('<li>').text(key));
      count++;
    }
    this.$('.count').html(count);
    this.$('.chatters').scrollTop( $('.chatters')[0].scrollHeight );
  }
  
});
