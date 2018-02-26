Fpkapp.ReadyState = SC.State.extend({

  enterState: function() {
    Fpkapp.getPath('mainPage.mainPane').append();
  },

  exitState: function() {
    Fpkapp.getPath('mainPage.mainPane').remove();
  }

});