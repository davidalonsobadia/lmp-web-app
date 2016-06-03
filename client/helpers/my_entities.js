Template.my_entities.onRendered(function(){
	var user = Session.get('user');
	var userEmail = user.email;

	this.subscriptions = [
		Meteor.subscribe('getEntitiesRequestedFromEntities', userEmail),
		Meteor.subscribe('getEntitiesRequestedFromUsers', userEmail),
		Meteor.subscribe('getAdminEntities', userEmail),
		Meteor.subscribe('getEntitiesAssociated', userEmail),
		];
});

Template.my_entities.onDestroyed(function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
});

Template.entitiesByUser.helpers({
	'Entities' : function(){
		var entitiesRequestedFromEntities = EntitiesRequestedFromEntities.find().fetch();
		var entitiesRequestedFromUsers = EntitiesRequestedFromUsers.find().fetch();
		var adminEntities = AdminEntities.find().fetch();
		var entitiesAssociated = EntitiesAssociated.find().fetch();

		var entities = entitiesRequestedFromEntities.concat(entitiesRequestedFromUsers)
			.concat(adminEntities).concat(entitiesAssociated);
		return entities;
	}
});

Template.EntitiesRequestedFromEntitiesTemplate.helpers({
	'EntitiesRequestedFromEntities': function(){
		var entitiesRequestedFromEntities = EntitiesRequestedFromEntities.find().fetch();
		return entitiesRequestedFromEntities;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.EntitiesRequestedFromUsersTemplate.helpers({
	'EntitiesRequestedFromUsers': function(){
		var entitiesRequestedFromUsers = EntitiesRequestedFromUsers.find().fetch();
		return entitiesRequestedFromUsers;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.AdminEntitiesTemplate.helpers({
	'AdminEntities': function(){
		var adminEntities = AdminEntities.find().fetch();
		return adminEntities;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.EntitiesAssociatedTemplate.helpers({
	'EntitiesAssociated': function(){
		var entitiesAssociated = EntitiesAssociated.find().fetch();
		return entitiesAssociated;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});


Template.my_entities.events({
	'click #newObject' : function(event){
	    event.preventDefault();
	    Router.go('new_entity');
	},
	'click .dissassociate': function(event){
		event.preventDefault();
		var entityId = event.currentTarget.id;
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;
		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				console.log(response);
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			window.location.reload(true);
		});
	},

	'click .use-entity' : function(event){
		event.preventDefault();
		var entityUrl = event.currentTarget.id;
		Meteor.call('getEntity', entityUrl, function(error, response){
			if(!error){
				Session.setPersistent('user', response);
			} else {
				console.log('An error ocurred while trying to get the entity');
				console.log(error);
			}
		});
		Router.go('home');
	},

	'click .associate-entity' : function(event){
		event.preventDefault();
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('changePersonOrganizationState', response, 'ASSOCIATED');
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			window.location.reload(true);
		});
	},

	'click .cancel-association-entity' : function(event){
		event.preventDefault();
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			window.location.reload(true);
		});
	}
});