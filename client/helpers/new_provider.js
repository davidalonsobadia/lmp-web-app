
Template.new_provider.events({
  // 'click .save-changes': function(event){
  //   event.preventDefault();
  //   var providers = $("[name=provider]").map(
  //     function(){
  //       if($(this).is(":checked")){
  //         return $(this).attr('id');
  //       }
  //     })
  //   .get();

  //   var previousProviders = ProvidersByUser.find().fetch();
  //   for ( p in previousProviders){
  //     providers.push(previousProviders[p].link);
  //   }

  //   var urlPerson = Session.get('user')._links.providers.href;
  
  //   Meteor.call('joinPersonAndProvider', urlPerson, providers);


  //   var newproviderNames = $("[name=provider]").map(
  //     function(){
  //       if($(this).is(":checked")){
  //         return $(this).attr('value');
  //       }
  //     })
  //   .get();

  //   console.log('providerNames: ' + newproviderNames);

  //   _.each(newproviderNames, function(providerName){

  //     console.log("newProviderName: ");
  //     console.log(providerName);

  //     var provider = Providers.find({name: providerName}).fetch()[0];

  //     console.log(provider)
  //     console.log(provider.oAuth);

  //     if(provider.oAuth){
  //       console.log(provider.name)
  //       Meteor.call('findTokenByproviderNameAndUserEmail', providerName, Session.get('user').email, function(error, response){
  //         if(error){
  //           console.log('error in findTokenByproviderNameAndUserEmail');
  //           console.log(error);
  //         } else {
  //           console.log('token: ' + response);

  //           if(response == null || response == undefined) {

  //             Meteor.call('createNewToken', providerName, Session.get('user').email, function(error, response){

  //               if(error){
  //                 console.log('error in createNewToken');
  //                 console.log(error);
  //               } else {
  //                 var encodedUrl = encodeURIComponent(response);
  //                 Router.go('newToken?url=' + encodedUrl);
  //               }

  //             })
  //           }
  //         }
  //       });   
  //     } else {
  //       Router.go('my_providers');
  //     }
  //     console.log(provider);
  //   });
  // },

  'click .add-provider': function(event){
    event.preventDefault();
    console.og('.add-provider');
    var providers = [];
    providers.push(event.currentTarget.id);

    var previousProviders = ProvidersByUser.find().fetch();
    for ( p in previousProviders){
      providers.push(previousProviders[p].link);
    }

    var currentProvider = Providers.find({name: event.currentTarget.name}).fetch()[0];

    if(currentProvider.oAuth) {
      Meteor.call('findTokenByproviderNameAndUserEmail', currentProvider.name, Session.get('user').email, function(error, response){
        if(error){
          console.log('error in findTokenByproviderNameAndUserEmail');
          console.log(error);
        } else {
          console.log('token: ' + response);

          console.log('evebhovewvfebhvibververve');

          if(response == null || response == undefined) {

/*            Meteor.call('createNewToken', currentProvider.name, Session.get('user').email, function(error, response){

              if(error){
                console.log('error in createNewToken');
                console.log(error);
              } else {

                var encodedUrl = encodeURIComponent(response);

                console.log('currentProvider');
                console.log(currentProvider.name);

                Session.setPersistent('provider', currentProvider.name);

                //window.location.protocol = "http";
                //window.location = response;
              }

            });*/

          }
        }
      });
    } else {

      var urlPerson = Session.get('user')._links.providers.href;
      Meteor.call('joinPersonAndProvider', urlPerson, providers);

      window.location.reload(true);
    }
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

  // 'checkedProviders': function(){
  //   // 1. get the provider identifier (here we will use name)
  //   var name = this.name;

  //   // 1.5 get all the providers so far activated by the user
  //   var user = Session.get('user');
  //   var providersUrl = user._links.providers.href;
  //   //var providers = ReactiveMethod.call('getProvidersbyPerson', providersUrl);
  //   var providers = ProvidersByUser.find().fetch();

  //   // 2. check if the provider identifier is on the person providers list.
  //   for( p in providers){
  //     // return either checked or '' depending on the previous result.
  //     if(providers[p].name == this.name){
  //       return 'checked'
  //     }
  //   }
  //   return '';
  // }
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