// ==========================================================================
// Project:    Fpkapp 
// Copyright:  My Company, Inc.
// ==========================================================================
/*globals Fpkapp */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and fire up the state chart.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Fpkapp.main = function main() {

  // Step 1: Set the statechart to be the default responder
  // The default code here will set the statechart as default responder for your application.
  // It means that any action which is not given a specific target will be sent to the
  // statechart. For most applications, this is the most convenient.
  var statechart = Fpkapp.statechart;
  SC.RootResponder.responder.set('defaultResponder', statechart);

  // Step 2. If you are using controllers which need to be setup with data before
  // your app comes alive (for example controllers holding menu options), do it here.
  // var content = Fpkapp.store.find(Fpkapp.Group);
  // Fpkapp.groupsController.set('content', content);
  // or
  // Fpkapp.menuListController.set('content', Fpkapp.menuOptions);

  // Step 3. Initialize the statechart and make your app come alive.
  statechart.initStatechart();
};


function main() { Fpkapp.main(); }
