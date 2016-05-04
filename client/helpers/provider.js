Template.my_providers.events({
  'click #newObject' : function(event){
    event.preventDefault();
    Router.go('new_provider');
  },
  'click .delete-provider' : function(event){
    event.preventDefault();
    var user = Session.get('user');
    var urlPersonProvider = user._links.providers.href;

    providerIdToDelete = event.currentTarget.id;

    var providersUrl = $("[name=delete-button]").map(
      function(){
        return $(this).attr('id');
    })
    .get();

    for(p in providersUrl){
      if(providersUrl[p] == providerIdToDelete){
        providersUrl.splice(p, 1);
      }
    }

    Meteor.call('joinPersonAndProvider', urlPersonProvider, providersUrl);
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
    return ProvidersByUser.find();
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


Template.new_provider.events({
  'click .save-changes': function(event){
    event.preventDefault();
    var providers = $("[name=provider]").map(
      function(){
        if($(this).is(":checked")){
          return $(this).attr('id');
        }
      })
    .get();

    var previousProviders = ProvidersByUser.find().fetch();
    for ( p in previousProviders){
      providers.push(previousProviders[p].link);
    }

    var urlPerson = Session.get('user')._links.providers.href;
    Meteor.call('joinPersonAndProvider', urlPerson, providers);
    Router.go('my_providers');
  },

  'click .cancel' : function(event) {
    event.preventDefault();
    Router.go('my_providers');
  }
});

Template.providersList.helpers({
  'Providers' : function(){
    return Providers.find().fetch();
  },

  'ProvidersByUser' : function(){
    return ProvidersByUser.find().fetch();
  },

  'checkedProviders': function(){
    // 1. get the provider identifier (here we will use name)
    var name = this.name;

    // 1.5 get all the providers so far activated by the user
    var user = Session.get('user');
    var providersUrl = user._links.providers.href;
    //var providers = ReactiveMethod.call('getProvidersbyPerson', providersUrl);
    var providers = ProvidersByUser.find().fetch();

    // 2. check if the provider identifier is on the person providers list.
    for( p in providers){
      // return either checked or '' depending on the previous result.
      if(providers[p].name == this.name){
        return 'checked'
      }
    }
    return '';
  }
});


Template.providersList.events({
  'change [name=select-all]': function(event){
    event.preventDefault();
    if(event.currentTarget.checked) {
      // Iterate each checkbox
      $('[name=provider]').each(function() {
          this.checked = true;                        
      });
    } else {
      $('[name=provider]').each(function() {
          this.checked = false;                        
      });
    }
  }
});