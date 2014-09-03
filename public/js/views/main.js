var MainView = Backbone.View.extend({
  el: '#app',
  
  initialize: function() {
    this.render();
  },
  
  template: _.template( $('#main').html()),
  
  render: function() {
    var attributes;
    this.$el.html(this.template(attributes));
  }
});

$(function(){
  var mainView = new MainView();
});
