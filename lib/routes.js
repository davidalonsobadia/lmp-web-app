
// Router configuration
Router.configure({
  loadingTemplate: 'loading-purple',
  defaultBreadcrumbTitle: 'Home',
  defaultBreadcrumbLastLink: true
});

//Routers
Router.route('/' , {
  name: 'login',
  template: 'index'
});

Router.route('/index' , {
  name: 'index',
  template: 'index'
});

Router.route('/register', {
  waitOn : function(){
    return Meteor.subscribe('getRegisteredEmailsandRegisteredIds');
  }
});

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

    var providerNames = [];

    for (p in providers){
      var provider = providers[p];
      var providerLink = provider.attributesLink;
      providerLinks.push(providerLink);
      providerNames.push(provider.name);
    }

    var sphere = Session.get('sphere');
    var sphereAttributesUrl = null;
    var sphereConsumerUrl = null;
    if(sphere != null){
      sphereAttributesUrl = sphere._links.attributes.href; 
      sphereConsumerUrl = sphere._links.consumers.href; 
    }

    var sphereUserUrl = user._links.spheres.href;

    return [ 
      Meteor.subscribe('getProvidersByUser', providersUrl)
      , Meteor.subscribe('getAttributesByProviders', providerNames)
      , Meteor.subscribe('getAttributesBySphere', sphereAttributesUrl)
      , Meteor.subscribe('getConsumersByUser', consumersUrl)
      , Meteor.subscribe('getConsumersInSphere',  sphereConsumerUrl)
      ];
  }
});

Router.route('/my_providers', {
  template: 'my_providers',
  title: 'My Providers',
  parent: 'home'
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

Router.route('/my_consumers', {
  template: 'my_consumers',
  parent: 'home',
  title: 'Consumers'
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

Router.route('/my_profile', {
  template: 'my_profile',
  title: 'My Profile',
  parent: 'home',
  data: function(){
    return Session.get('user');
  }
});

Router.route('/my_entities', {
  template: 'my_entities',
  title: 'My Entities',
  parent: 'home'
});

Router.route('/new_entity', {
  template: 'new_entity',
  title: 'New Entity',
  parent: 'my_entities',
  waitOn: function(){
    var userEmail = Session.get('user').email;
    return [
      Meteor.subscribe('getEntities'),
      Meteor.subscribe('getEntitiesWithRelationship', userEmail)
    ];
  }
});

Router.route('/entity_profile', {
  template: 'entity_profile',
  title: 'Entity Profile',
  parent: 'home',
  data: function(){
    return Session.get('user');
  }
});

Router.route('/people', {
  template: 'people',
  title: 'People',
  parent: 'home',
  data: function(){
    return Session.get('user');
  }
});

Router.route('/new_person', {
  template: 'new_person',
  title: 'New User',
  parent: 'people',
  waitOn: function(){
    var entityEmail = Session.get('user').email;
    return [
      Meteor.subscribe('getPeople'),
      Meteor.subscribe('getPeopleWithRelationship', entityEmail)
    ];
  }
});

var loginRequired = function(){
  var userSession = Session.get('user');
  if (userSession != null && userSession != undefined ){
    this.next();
  } else {
    Router.go('login');
  }
}
Router.onBeforeAction(loginRequired, {except : ['login', 'register',
 'index', 'forgotPassword', 'changePassword']});

var cleanSphereSessionVariable = function(){}

Router.onAfterAction(cleanSphereSessionVariable, { except: ['newSphere']});



// New routes for Dashboard

Router.route('/dashboard' , {
  name: 'dashboard',
  template: 'dashboard'
});

Router.route('/user' , {
  name: 'user',
  template: 'user',
  data: function(){
    return Session.get('user');
  }
});

Router.route('/providers' , {
  name: 'providers',
  template: 'providers'
});

Router.route('/consumers' , {
  name: 'consumers',
  template: 'consumers'
});

Router.route('/spheres' , {
  name: 'spheres',
  template: 'spheres'
});

Router.route('/entities' , {
  name: 'entities',
  template: 'entities'
});

Router.route('/notifications' , {
  name: 'notifications',
  template: 'notifications'
});

Router.route('/template' , {
  name: 'template',
  template: 'template'
});

Router.route('/icons' , {
  name: 'icons',
  template: 'icons'
});

Router.route('/users_entity', {
  name: 'users_entity',
  template: 'users_entity'
});

Router.route('/entity', {
  name: 'entity',
  template: 'entity'
});

Router.route('/forgotPassword', {
  name: 'forgotPassword',
  template: 'forgotPassword',
  waitOn: function(){
    return Meteor.subscribe('getRegisteredEmailsandRegisteredIds');
  }
});

Router.route('changePassword', {
  name: 'changePassword',
  template: 'changePassword'
});
