Template.entity_form.onRendered(function(){
	$('.entity').validate({
		rules: {
			name: {
				required: true
			},
			email: {
				required: true
			}
		}
	});
});

Template.entity_form.events({
	'submit form': function(event){
		event.preventDefault();

		var name = $('[name=name]').val();
		var description = $('[name=description]').val();
		var email = $('[name=email]').val();

		var entityObject = {
			name: name,
			description: description,
			email: email
		};

		var entityUrl = Session.get('user')._links.self.href;

		Meteor.call('updateEntity', entityObject, entityUrl, function(error, response){
			if(!error){

				Meteor.call('getEntity', entityUrl, function(error, response){
					if(!error){
						Session.setPersistent('user', response);
					} else {
						console.log('An error occurred in getEntity');
						console.log(error);
					}
				})
			} else {
				console.log('An error occurred updating the entity');
				console.log(error);
			}
		});

		Router.go('/home');
	},

	'click .cancel': function(event){
		event.preventDefault();
		Router.go('/home');
	},

	'click .delete-entity' : function(event){
		event.preventDefault();
		console.log('in click .delete-entity');
		var entity = Session.get('user');

		var entityLink = entity._links.self.href;

		Meteor.call('getAndDeletePersonOrganizationRelationshipsByEntityEmail', entity.email, function(error, response){
			if(!error){
				Meteor.call('deleteEntity', entityLink);
			}
		})
		Session.setPersistent('user', Session.get('person'));
		Router.go('home');
	}
});