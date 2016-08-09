Template.my_providers.events({
  'click #newObject' : function(event){
    event.preventDefault();
    Router.go('new_provider');
  },
  'click .delete-provider' : function(event){
    event.preventDefault();

/*  var user = Session.get('user');
    var urlPersonProvider = user._links.providers.href;

    providerUrlToDelete = event.currentTarget.id;

    var providersUrl = $("[name=delete-button]").map(
      function(){
        return $(this).attr('id');
    })
    .get();

    for(p in providersUrl){
      if(providersUrl[p] == providerUrlToDelete){
        providersUrl.splice(p, 1);
      }
    }
*/

    var personId = Session.get('user').id;
    var providerIdToDelete = event.currentTarget.name;

    console.log(providerIdToDelete);
    console.log(personId);

    Meteor.call('deletePersonAndProviderRelation', providerIdToDelete, personId);
    window.location.reload(true);
  },

  'change [type=checkbox]': function(event){
    event.preventDefault();
    var enabled = event.currentTarget.checked;
    var providerUrl = event.currentTarget.id;
    Meteor.call('updateProviderEnabled', enabled, providerUrl);
  }
});

Template.providersTable.helpers({
  'Providers' : function(){
    return ProvidersByUser.find({}, {sort: {name: 1}});
  },
  'ready': function () {
    return _.all(Template.instance().subscriptions, function (sub) {
      return sub.ready();
    });
  },
  'checkedObject': function(){
    var isEnabled = this.enabled;
    if(isEnabled){
      return "checked";
    } else {
      return "";
    }
  }
});



Template.my_providers.onRendered(function(){
  var user = Session.get('user');
  var providersUrl = user._links.providers.href;
  this.subscriptions = [
    Meteor.subscribe('getProvidersByUser', providersUrl)
    /* ... */
  ];
});

Template.my_providers.onDestroyed(function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
});