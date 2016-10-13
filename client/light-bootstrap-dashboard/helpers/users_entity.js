/*Template.users_entity.onRendered(function(){
	var entity = Session.get('user');
	var entityEmail = entity.email;

	this.subscriptions = [
		Meteor.subscribe('getUsersRequestedFromEntities', entityEmail),
		Meteor.subscribe('getUsersRequestedFromUsers', entityEmail),
		Meteor.subscribe('getAdminUsers', entityEmail),
		Meteor.subscribe('getUsersAssociated', entityEmail),
		Meteor.subscribe('getPeople')
		];
});*/

Template.new_users_entity_form.onRendered(function(){
	this.autorun(function(){
		var entity = Session.get('user');
		var entityEmail = entity.email;
		return [
			Meteor.subscribe('getUsersRequestedFromEntities', entityEmail),
			Meteor.subscribe('getUsersRequestedFromUsers', entityEmail),
			Meteor.subscribe('getAdminUsers', entityEmail),
			Meteor.subscribe('getUsersAssociated', entityEmail),
			Meteor.subscribe('getPeople')
		];
	});
});

Template.my_users_entity_table.onRendered(function(){
	this.autorun(function(){
		var entity = Session.get('user');
		var entityEmail = entity.email;
		return [
			Meteor.subscribe('getUsersRequestedFromEntities', entityEmail),
			Meteor.subscribe('getUsersRequestedFromUsers', entityEmail),
			Meteor.subscribe('getAdminUsers', entityEmail),
			Meteor.subscribe('getUsersAssociated', entityEmail),
			Meteor.subscribe('getPeople')
		];
	});
});



Template.content_users_entity.onCreated(function(){
	var self = this;
    self.vars = new ReactiveDict();
    self.vars.setDefault('clicked', false); //default is true
});

Template.content_users_entity.helpers({
	clicked:function(){
 		var instance = Template.instance(); //http://docs.meteor.com/#/full/template_instance
 		return instance.vars.get('clicked'); //this will return false(default) | true
 	}
});

Template.content_users_entity.events({
	'click .add-new-element': function(event){
		event.preventDefault();
		var instance = Template.instance();
        instance.vars.set('clicked', true); //set to true.
  	},
  	'click .back-to-my-users': function(event,template){
  		var instance = Template.instance();
  		instance.vars.set('clicked', false);
	}
})

Template.my_users_entity_table.helpers({
	'People': function(){
		var usersRequestedFromEntities = UsersRequestedFromEntities.find().fetch();
		var usersRequestedFromUsers = UsersRequestedFromUsers.find().fetch();
		var adminUsers = AdminUsers.find().fetch();
		var usersAssociated = UsersAssociated.find().fetch();
		var people = usersRequestedFromEntities.concat(usersRequestedFromUsers)
			.concat(adminUsers).concat(usersAssociated);
		return people;
	}
});

Template.users_entity_requested.helpers({
	'UsersRequestedFromEntities': function(){
		var usersRequestedFromEntities = UsersRequestedFromEntities.find().fetch();
		return usersRequestedFromEntities;
	},
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



Template.users_entity_admin.helpers({
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

Template.users_entity_associated.helpers({
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

Template.my_users_entity_table.events({

	'click .dissassociate': function(event){
		event.preventDefault();
		var entityId = event.currentTarget.id;
		var userEmail = event.currentTarget.name;
		var entityEmail = Session.get('user').email;
		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			$(event.currentTarget).parent().parent().fadeOut();
		});
	},

	'click .associate-user' : function(event){
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
			$(event.currentTarget).parent().parent().fadeOut();
		});
	},

	'click .cancel-association-entity' : function(event){
		event.preventDefault();
		var userEmail = event.currentTarget.name;
		var entityEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response, function(error, response){
					if(error){
						console.log('error in deletePersonOrganizationRelationship');
						console.log(error);
					}
				});
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			$(event.currentTarget).parent().parent().fadeOut();
		});
	}
});



// Add new person functions
Template.new_users_entity_form.onRendered(function(){
	$('.alert').hide();

	$('.check-user-form').validate({
		rules: {
			email: {
				existingUser: true,
				email: true
			}
		},
		messages: {
			email: {
				existingUser: 'This email does not exist in our Database. Please verify it email is correct.'
			}
		},
		submitHandler: function(event){		
			var userEmail = $('[name=email]').val();
			$('.alert').hide();

			//chequear que aun no hemos enviado ninguna peticion
			var peopleWithRelationship = PeopleWithRelationship.find().fetch();
			var personInList = _.find(peopleWithRelationship, function(person){
				return person.email == userEmail 
			});

			if (personInList){
				$('.alert-warning').show();
				$('.alert-warning').fadeTo(5000, 1).slideUp(500, function(){
          			});
			} else {
				var entityUrl = Session.get('user')._links.self.href;
				var person = People.findOne({email: userEmail});
				var personUrl = person.link;
				Meteor.call('insertPersonOrganizationRelationship', personUrl, entityUrl, 'REQUESTED_FROM_ENTITY',  function(error, response){
					if(!error){
						Meteor.subscribe('getPeopleWithRelationship', Session.get('user').email);
						$('.alert-success').show();
						$('.alert-success').fadeTo(5000, 1).slideUp(500, function(){
          					});
					} else {
						console.log('error in insertPersonOrganizationRelationship');
						console.log(error);
					} 
				});
			}
		}
	})
});


$.validator.addMethod('existingUser', function(email){
  let exists = People.findOne({ email: email}, {fields: { email: 1}});
  return exists ? true : false;
});


Template.new_users_entity_form.events({
	'submit form': function(event){
		event.preventDefault();
	},
	'click .close': function(event){
		event.preventDefault();
		$(event.currentTarget).parent().hide();
	}
});

Template.users_entity_associated.events({
	'click .dissassociate': function(event){
		event.preventDefault();
		console.log('dissassociate dissassociate dissassociate');

	}

});