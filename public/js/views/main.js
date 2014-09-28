var ChatView = Backbone.View.extend({
  el: '#app',
  
  events: {
    'click .send-btn': 'msgSubmit',
    'submit .send-form': 'msgSubmit'
  },
  
  initialize: function(options) {
    this.vent = options.vent;
    this.chattersView = new ChattersView({collection: this.model.get('onlineUsers')});
    this.render();
  },
  
  template: _.template( $('#main').html()),
  
  render: function() {
    console.log("users", this.model.get('onlineUsers'))
    var attributes;
    this.$el.html(this.template(attributes));
    $('#chatters').html(this.chattersView.el);
    this.afterRender();
  },
  
  afterRender: function() {
    this.$('.messages').css('height',( $(window).height() / 2) );
    this.$('.chatters').css('height',( $(window).height() / 2) );
  },
  
  msgSubmit: function(e) {
    var message = this.$('#m').val();
    this.vent.trigger('pushMessage', message);
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
  }
  
});

var ChattersView = Backbone.View.extend({
  initialize: function() {
    this.listenTo( this.collection, 'add remove', this.render);
    this.render();
  },

  render: function() {
    this.$el.children().detach();

    this.$el.html('<h5>' + this.collection.length + ' Chatters</h5>')
      .append(
        this.collection.map(function(chatter){
          return new ChatterEntryView({model: chatter}).render();
        })
      );
  }

});

var ChatterEntryView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model,'change',this.render);
    this.render();
  },

  template: _.template('<span><%= name %></span>'),

  events: {
    'click': function() {
      console.log("clicked");
    }
  },

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});
