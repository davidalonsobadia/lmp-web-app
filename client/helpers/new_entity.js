Template.new_entity.onRendered(function(){
	$('.new-entity-form').validate({
		rules: {
			name: {
				required: true
			},

			email: {
				required: true,
				email: true,
				notExistingEmail: true
			}
		},
		messages: {
			email:{
				notExistingEmail: 'This email already exists as an Entity email.'
			}
		},
		submitHandler: function(event){
			var name = $('[name=name]').val();
			var description = $('[name=description]').val();
			var email = $('[name=email]').val();
			var identifier = name.hashCode() + email.hashCode();
			var entityObject = {
				identifier: identifier,
				name: name,
				description: description,
				email: email
			};
			var userUrl = Session.get('user')._links.self.href;
			Meteor.call('upsertEntity', entityObject, userUrl, function(error, response){
				if (!error){
					console.log(response);
					Meteor.call('insertPersonOrganizationRelationship', userUrl, response, 'ADMINISTRATOR');
				} else {
					console.log('error');
					console.log(error);
				}
				Router.go('my_entities');
			});
			
		}
	}
	);

	$('.check-entity-form').validate({
		rules: {
			entityEmail: {
				existingEntity: true,
				email: true
			}
		},
		messages: {
			entityEmail: {
				existingEntity: 'This email Entity does not exist in our Entity Database. Please verify it email is correct.'
			}
		},
		submitHandler: function(event){		
			var entityEmail = $('[name=entityEmail]').val();
			$('.alert').hide();

			//chequear que aun no hemos enviado ninguna peticion
			var entitiesWithRelationship = EntitiesWithRelationship.find().fetch();
			var entityInList = _.find(entitiesWithRelationship, function(entity){ return entity.email == entityEmail });

			if (entityInList){
				$('.alert-warning').show();
			} else {
				var userUrl = Session.get('user')._links.self.href;
				var entity = Entities.findOne({email: entityEmail});
				var entityUrl = entity.link;
				Meteor.call('insertPersonOrganizationRelationship', userUrl, entityUrl, 'REQUESTED_FROM_USER',  function(error, response){
					if(!error){
						Meteor.subscribe('getEntitiesWithRelationship', Session.get('user').email);
						$('.alert-success').show();
					} else {
						console.log('error in insertPersonOrganizationRelationship');
						console.log(error);
					} 
				});
			}
		}
	})
});


$.validator.addMethod('existingEntity', function(email){
  let exists = Entities.findOne({ email: email}, {fields: { email: 1}});
  return exists ? true : false;
});

$.validator.addMethod('notExistingEmail', function(email){
  let exists = Entities.findOne({ email: email}, {fields: { email: 1}});
  return exists ? false : true;
});

Template.new_entity.events({
	'submit form': function(event){
		event.preventDefault();
	}
});

Template.check_entity.events({
	'submit form': function(event){
		event.preventDefault();
	},

	'click .close': function(event){
		event.preventDefault();
		$(event.currentTarget).parent().hide();
	}
})