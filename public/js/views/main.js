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
    $('.messages').css('height',( $(window).height() / 2) );
    $('.chatters').css('height',( $(window).height() / 2) );
  },
  
  sendBtn: function() {
    this.$('.send-form').submit();
  },
  
  msgSubmit: function(){
      var message = $('#m').val();
      socket.emit('chat message', message);
      $('#m').val('');
      addtoChat({username:username,message:message});
      return false;
  }
  
});
