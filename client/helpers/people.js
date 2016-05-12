Template.people.onRendered(function(){
	var entity = Session.get('user');
	var entityEmail = entity.email;

	this.subscriptions = [
		Meteor.subscribe('getUsersRequestedFromEntities', entityEmail),
		Meteor.subscribe('getUsersRequestedFromUsers', entityEmail),
		Meteor.subscribe('getAdminUsers', entityEmail),
		Meteor.subscribe('getUsersAssociated', entityEmail)
		];
});

Template.people.onDestroyed(function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
});

Template.UsersRequestedFromEntitiesTemplate.helpers({
	'UsersRequestedFromEntities': function(){
		var usersRequestedFromEntities = UsersRequestedFromEntities.find().fetch();
		return usersRequestedFromEntities;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.UsersRequestedFromUsersTemplate.helpers({
	'UsersRequestedFromUsers': function(){
		var usersRequestedFromUsers = UsersRequestedFromUsers.find().fetch();
		return usersRequestedFromUsers;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.AdminUsersTemplate.helpers({
	'AdminUsers': function(){
		var adminUsers = AdminUsers.find().fetch();
		return adminUsers;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.UsersAssociatedTemplate.helpers({
	'UsersAssociated': function(){
		var usersAssociated = UsersAssociated.find().fetch();
		return usersAssociated;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.people.events({
	'click #newObject' : function(event){
	    event.preventDefault();
	    Router.go('new_person');
	},

	'click .cancel-association-user' : function(event){
		event.preventDefault();
		var userEmail = event.currentTarget.name;
		var entityEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			window.location.reload(true);
		});
	},

	'click .associate-user': function(event){
		event.preventDefault();
		var userEmail = event.currentTarget.name;
		var entityEmail = Session.get('user').email;

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

	'click .dissassociate-user': function(event){
		event.preventDefault();
		var userEmail = event.currentTarget.name;
		var entityEmail = Session.get('user').email;
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

	}
});


