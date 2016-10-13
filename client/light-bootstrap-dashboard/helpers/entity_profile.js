Template.content_entity_profile.helpers({
	'entity': function(){
		return Session.get('user');
	}
});

/*Template.content_entity_profile.onRendered(function(){
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
*/


Template.content_entity_profile.events({
	'submit form': function(event){
		event.preventDefault();

		var name = $('[name=name]').val();
		var description = $('[name=description]').val();
		var email = $('[name=email]').val();

		var entityObject = {
			name: name,
			description: description,
			email: email,
			identifier: Session.get('user').identifier
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
	}
});

Template.delete_entity.events({
	'click .delete-entity' : function(event){
		event.preventDefault();
		var entity = Session.get('user');

		var entityLink = entity._links.self.href;

		Meteor.call('getAndDeletePersonOrganizationRelationshipsByEntityEmail', entity.email, function(error, response){
			if(!error){
				Meteor.call('deleteEntity', entityLink);
			}
		})
		Session.setPersistent('user', Session.get('person'));
	}
})