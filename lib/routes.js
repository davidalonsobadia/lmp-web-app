
// Router configuration
Router.configure({
  loadingTemplate: 'loader',
  defaultBreadcrumbTitle: 'Home',
  defaultBreadcrumbLastLink: true
});

//Routers
Router.route('/' , {
  name: 'login',
  template: 'login'
});
Router.route('/register');

Router.route('/home');

Router.route('/my_spheres', {
  template: 'my_spheres',
  parent: 'home',
  title: 'My Spheres',
  waitOn : function(){
    var user = Session.get('user');
    var spheresUrl = user._links.spheres.href;
    return Meteor.subscribe('getSpheresByUser', spheresUrl);
  }
});

Router.route('/useraccount');

Router.route('/new_sphere', {
  name: 'new_sphere',
  template: 'new_sphere',
  title: 'new Sphere',
  parent: 'my_spheres',
  waitOn: function(){
    var user = Session.get('user');
    var providersUrl = user._links.providers.href;
    var consumersUrl = user._links.consumers.href;
    var attributes = Attributes.find().fetch();
    var providers = ProvidersByUser.find().fetch();
    var providerLinks = [];

    for (p in providers){
      var provider = providers[p];
      var providerLink = provider.attributesLink;
      providerLinks.push(providerLink);
    }

    var sphere = Session.get('sphere');
    var sphereAttributesUrl = null;
    var sphereConsumerUrl = null;
    if(sphere != null){
      sphereAttributesUrl = sphere._links.attributes.href; 
      sphereConsumerUrl = sphere._links.consumers.href; 
    }

    var sphereUserUrl = user._links.spheres.href;

    return [ Meteor.subscribe('getAttributes')
      , Meteor.subscribe('getProvidersByUser', providersUrl)
      , Meteor.subscribe('getAttributesByProviders', providerLinks)
      , Meteor.subscribe('getAttributesBySphere', sphereAttributesUrl)
      , Meteor.subscribe('getConsumersByUser', consumersUrl)
      , Meteor.subscribe('getConsumersInSphere',  sphereConsumerUrl)
      ];
  }
});

/*Router.route('/sphere/:_id', {
  name: 'sphereDetails',
  template: 'sphere',
  title: 'Details',
  parent: 'dataspheres'*//*,
  data: function(){
    console.log('route');
    var url = 'http://localhost:8080/spheres/5';
    console.log(url);
    Meteor.call('getSphere', url, function(error, response){
      if(!error){
        //succeed
        console.log('response');
        console.log(response);
        //2.pass the sphere
        Router.go('sphereDetails', {_id: response});
      } else {
        console.log(error);
      }

    });
    //return Spheres.findOne({_id: this.params._id});
  },*/
  /*
  waitOn : function(){
    return [Meteor.subscribe('getSphereById', this.params._id)
      , Meteor.subscribe('getAttributesDefinition')
      , Meteor.subscribe('getAttributes')
      , Meteor.subscribe('getConsumers')];
  }*/
/*});*/
Router.route('/my_providers', {
  template: 'my_providers',
  title: 'My Providers',
  parent: 'home'/*,
  waitOn : function(){
    var user = Session.get('user');
    var providersUrl = user._links.providers.href;
    return Meteor.subscribe('getProvidersByUser', providersUrl);
  }*/
});

Router.route('/new_provider', {
  template: 'new_provider',
  title: 'New Provider',
  parent: 'my_providers',
  waitOn: function(){
    var user = Session.get('user');
    var providersUrl = user._links.providers.href;
    return [ Meteor.subscribe('getProviders')
      , Meteor.subscribe('getProvidersByUser', providersUrl)
      ];
  }
});
/*Router.route('/provider/:_id', {
  name: 'providerDetails',
  template: 'provider',
  title: 'Details',
  parent: 'my_providers'
  data: function(){
    return Providers.findOne({_id: this.params._id});
  },
  waitOn: function(){
    var provider = Providers.findOne({_id: this.params._id}, {fields: {name: 1}});
    var nameProvider;
    if (provider != undefined){
      nameProvider = provider.name;
      console.log("provider Name: " + nameProvider);
      return [Meteor.subscribe('getProviderById', this.params._id)
        , Meteor.subscribe('getAttributesFromProvider', nameProvider)
        , Meteor.subscribe('getAttributesDefinition')];
    } else {
      return [Meteor.subscribe('getProviderById', this.params._id)
        , Meteor.subscribe('getAttributesDefinition')];
    }
  }
});
*/
Router.route('/my_consumers', {
  template: 'my_consumers',
  parent: 'home',
  title: 'Consumers'/*,
  waitOn: function(){
    var user = Session.get('user');
    var consumersUrl = user._links.consumers.href;
    console.log('in waitOn function of my_consumers');
    console.log(ConsumersByUser.find().fetch());
    return Meteor.subscribe('getConsumersByUser', consumersUrl);
  }*/
});

Router.route('/new_consumer', {
  template: 'new_consumer',
  title: 'New Consumer',
  parent: 'my_consumers',
  waitOn: function(){
    var user = Session.get('user');
    var consumersUrl = user._links.consumers.href;
    return [
      Meteor.subscribe('getConsumers'),
      Meteor.subscribe('getConsumersByUser', consumersUrl)
      ];
  }
});


var loginRequired = function(){
  /*var next = this.next;
  Meteor.call('getUserSession', function(error, result){  
    if (result){
      next();
    } else {
      Router.go('login');
    }
  });*/

  var userSession = Session.get('user');
  if (userSession != null && userSession != undefined ){
    this.next();
  } else {
    Router.go('login');
  }
}
Router.onBeforeAction(loginRequired, {except : ['login', 'register']});

var cleanSphereSessionVariable = function(){
  // Reset Session for sphere variable
  //Session.setPersistent('sphere', null);
}
Router.onAfterAction(cleanSphereSessionVariable, { except: ['newSphere']});