var ChatView = Backbone.View.extend({
  el: '#app',
  
  events: {
    'click .send-btn': 'msgSubmit',
    'submit .send-form': 'msgSubmit'
  },
  
  initialize: function(options) {
    this.vent = options.vent;
    this.chattersView = new ChattersView({collection: this.model.get('onlineUsers')});
    this.messagesView = new MessagesView({collection: this.model.get('userChats')});

    this.listenTo(this.model.get('userChats'),'add',this.scroll);
    this.listenTo(this.model.get('onlineUsers'),'add',this.scroll);

    this.render();
  },
  
  template: _.template( $('#main').html()),

  scroll: function() {
    this.$('.messages').scrollTop( $('.messages')[0].scrollHeight );
  },
  
  render: function() {
    var attributes;
    this.$el.html(this.template(attributes));
    $('#chatters').html(this.chattersView.el);
    $('#messages').html(this.messagesView.el);
    this.afterRender();
  },
  
  afterRender: function() {
    this.$('.messages').css('height',( $(window).height() / 2) );
    this.$('.chatters').css('height',( $(window).height() / 2) );
  },
  
  msgSubmit: function(e) {
    e.preventDefault();
    var message = this.$('#m').val();
    this.vent.trigger('pushMessage', {sender: this.model.get('username'), message: message });
    this.$('#m').val('');
    this.vent.trigger('addtoChat', { sender: this.model.get('username'), message: message });
  }
  
});

var ChattersView = Backbone.View.extend({

  tagName: 'ul',

  className: 'chatters',

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

  tagName: 'li',

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

var MessagesView = Backbone.View.extend({

  tagName: 'ul',

  className: 'messages',

  initialize: function() {
    this.listenTo(this.collection, 'add remove', this.render);
    this.render()
  },
  
  render: function() {
    this.$el.html(
      this.collection.map(function(msg) {
        return new MessageEntryView({model: msg }).render();
      })
    );
  }

});

var MessageEntryView = Backbone.View.extend({
  
  tagName: 'li',
  
  initialize: function(){
    this.listenTo(this.model,'change',this.render);
    this.render();
  },

  template: _.template('<span class="sender"><%= sender %></span><span class="msg"><%= message %></span>'),

  events: {
    'click': function() {
      console.log("clicked");
    }
  },

  render: function(){
    this.$el.html(this.template(this.model.attributes));
    if (this.model.get('PSA')) {
      this.$el.addClass('PSA');
    }
    return this.$el;
  }
});
