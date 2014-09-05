var MainView = Backbone.View.extend({
  el: '#app',
  
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
  }
});

$(function(){
  var mainView = new MainView();
});
