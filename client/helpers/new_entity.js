Template.new_entity_form.onRendered(function(){
	var validator = $('.entity-form').validate({
		rules: {
			name: {
				required: true
			},

			email: {
				required: true
			}
		},

		submitHandler: function(event){

			var name = $('[name=name]').val();
			var description = $('[name=description]').val();
			var email = $('[name=email]').val();

			var identifier = name.hashCode() + email.hashCode();
			console.log(identifier);

			var entityObject = {
				identifier: identifier,
				name: name,
				description: description,
				email: email
			};

			var userUrl = Session.get('user')._links.self.href;

			Meteor.call('upsertEntity', entityObject, userUrl);

			Router.go('my_entities');
		}
	}
	);
});

Template.new_entity.events({
	'submit form': function(event){
		event.preventDefault();
	},

	'click .cancel': function(event){
		event.preventDefault();
		Router.go('my_entities');
	}
});