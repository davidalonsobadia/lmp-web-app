Template.my_providers_table.helpers({
  'ProvidersByUser' : function(){
    return ProvidersByUser.find({}, {sort: {name: 1}});
  }
});

Template.my_providers_table.events({
	'click .delete-provider': function(event){
		event.preventDefault();
		var providerId = event.currentTarget.name;
		Meteor.call('deletePersonAndProviderRelation', providerId, 
			Session.get('user').id, function(error, response){
			//success
			if(!error){
				$(event.currentTarget).parent().parent().fadeOut();
				// hide element with another effect
				/*$(event.currentTarget).parent().parent()
				.children('td, th')
		            .animate({
		            padding: 0
		        })
		            .wrapInner('<div />')
		            .children()
		            .slideUp(function () {
		            $(this).closest('tr').remove();
		        });*/
			}	
		});

	}
});

Template.content_providers.onCreated(function(){
	var self = this;
    self.vars = new ReactiveDict();
    self.vars.setDefault('clicked', false); //default is true
});

Template.my_providers_table.onRendered(function(){
	this.autorun(function(){
		var providersUrl = Session.get('user')._links.providers.href;
		return Meteor.subscribe('getProvidersByUser', providersUrl);
	});
});

Template.new_providers_table.onRendered(function(){
	this.autorun(function(){
		var providersUrl = Session.get('user')._links.providers.href;
		return [ 
			Meteor.subscribe('getProviders'),
			Meteor.subscribe('getProvidersByUser', providersUrl)
		];
	});
});

Template.content_providers.helpers({
	clicked:function(){
 		var instance = Template.instance(); //http://docs.meteor.com/#/full/template_instance
 		return instance.vars.get('clicked'); //this will return false(default) | true
 	}
});

Template.content_providers.events({
	'click .add-new-element':function(event,template){
    	var instance = Template.instance();
        instance.vars.set('clicked', true); //set to true.
  	},
  	'click .back-to-my-providers': function(event,template){
  		var instance = Template.instance();
  		instance.vars.set('clicked', false);
  	}
});

Template.new_providers_table.helpers({
  'Providers' : function(){
    return Providers.find().fetch();
  },
  'ProvidersByUser' : function(){
    return ProvidersByUser.find().fetch();
  }
});

Template.new_providers_table.events({
	'click .add-provider': function(event){
		event.preventDefault();
		
	    var currentProvider = Providers.find({name: event.currentTarget.name}).fetch()[0];

	    if(currentProvider.oAuth) {
			Meteor.call('findTokenByproviderNameAndUserEmail', currentProvider.name, 
				Session.get('user').email, function(error, response){
				if(error){
				  console.log('error in findTokenByproviderNameAndUserEmail');
				  console.log(error);
				} else {
				  console.log('token: ' + response);
				  if(response == null || response == undefined) {
				    Meteor.call('getAuthorizationUrl', currentProvider.name, Session.get('user').email, function(error, response){
				      if(error){
				        console.log('error in getAuthorizationUrl');
				        console.log(error);
				      } else {
				        Session.setPersistent('provider', currentProvider.name);
				        window.location.protocol = "http";
				        window.location = response;
				      }
				    });
				  }
				}
			});
	    } else {
	      var providersUrl = Session.get('user')._links.providers.href;
	      Meteor.call('getProvidersByUser', providersUrl, function(error, response){
	      	//success
	      	if(!error){
	      		var providers = []
	      		_.each(response, function(provider){
	      			providers.push(provider._links.self.href);
	      		})
	      		providers.push(event.currentTarget.id);
	      		console.log(providers);
	      		var urlPerson = Session.get('user')._links.providers.href;
	      		Meteor.call('joinPersonAndProvider', urlPerson, providers);
	      	} else {
	      		console.log('error doing getProvidersByUser');
	      		console.log(error);
	      	}
	      });
	    }
	    $(event.currentTarget).parent().parent().fadeOut();
	}
});


