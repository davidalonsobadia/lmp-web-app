// Template.my_providers.events({
//   'click #newObject' : function(event){
//     event.preventDefault();
//     Router.go('new_provider');
//   },
//   'click .delete-provider' : function(event){
//     event.preventDefault();

//     var personId = Session.get('user').id;
//     var providerIdToDelete = event.currentTarget.name;

//     Meteor.call('deletePersonAndProviderRelation', providerIdToDelete, personId);
//     window.location.reload(true);
//   },

//   'change [type=checkbox]': function(event){
//     event.preventDefault();
//     var enabled = event.currentTarget.checked;
//     var providerUrl = event.currentTarget.id;
//     Meteor.call('updateProviderEnabled', enabled, providerUrl);
//   }
// });

// Template.providersTable.helpers({
//   'Providers' : function(){
//     return ProvidersByUser.find({}, {sort: {name: 1}});
//   },
//   'ready': function () {
//     return _.all(Template.instance().subscriptions, function (sub) {
//       return sub.ready();
//     });
//   },
//   'checkedObject': function(){
//     var isEnabled = this.enabled;
//     if(isEnabled){
//       return "checked";
//     } else {
//       return "";
//     }
//   }
// });



// Template.my_providers.onRendered(function(){
//   var user = Session.get('user');
//   var providersUrl = user._links.providers.href;
//   this.subscriptions = [
//     Meteor.subscribe('getProvidersByUser', providersUrl)
//     /* ... */
//   ];
// });

// Template.my_providers.onDestroyed(function () {
//   _.each(this.subscriptions, function (sub) {
//     sub.stop();
//   });
// });