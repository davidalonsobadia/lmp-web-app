
// Router configuration
Router.configure({
  loadingTemplate: 'loading',
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

Router.route('/dataspheres', {
  parent: 'home',
  title: 'My Spheres',
  /*,
  waitOn : function(){
    return Meteor.subscribe('getSpheres');
  }*/
});
Router.route('/useraccount');

Router.route('/sphere', {
  name: 'newSphere',
  template: 'sphere',
  title: 'new Sphere',
  parent: 'dataspheres'
  /*,
  waitOn: function(){
    return [ Meteor.subscribe('getAttributesDefinition')
      , Meteor.subscribe('getAttributes')
      , Meteor.subscribe('getConsumers')];
  }*/
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
Router.route('/providers', {
  name: 'providers',
  title: 'My Providers',
  parent: 'home',
/*  waitOn : function(){
    return Meteor.subscribe('getProviders');
  }*/
});

Router.route('/provider', {
  name: 'newProvider',
  template: 'provider',
  title: 'New Provider',
  parent: 'providers'
  /*waitOn: function(){
    return [Meteor.subscribe('getProvider')]
  }*/
});
Router.route('/provider/:_id', {
  name: 'providerDetails',
  template: 'provider',
  title: 'Details',
  parent: 'providers'
/*  data: function(){
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
  }*/
});

Router.route('/consumers', {
  parent: 'home',
  title: 'Consumers',
  waitOn: function(){
    return Meteor.subscribe('getConsumersPublish');
  }
});

Router.route('/consumer', {
  name: 'newConsumer',
  template: 'consumer',
  title: 'New Consumer',
  parent: 'consumers'
})


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
  Session.setPersistent('sphere', null);
}
Router.onAfterAction(cleanSphereSessionVariable, { except: ['newSphere']});