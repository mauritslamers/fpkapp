Fpkapp.statechart = SC.Statechart.create({

  initialState: 'readyState',

  readyState: SC.State.plugin('Fpkapp.ReadyState')
  // someOtherState: SC.State.plugin('Fpkapp.SomeOtherState')

});