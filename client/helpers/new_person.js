
Template.new_person.onRendered(function(){
	$('.check-person-form').validate({
		rules: {
			userEmail: {
				existingUser: true,
				email: true
			}
		},
		messages: {
			userEmail: {
				existingUser: 'This email does not exist in our Database. Please verify it email is correct.'
			}
		},
		submitHandler: function(event){		
			var userEmail = $('[name=userEmail]').val();
			$('.alert').hide();

			//chequear que aun no hemos enviado ninguna peticion
			var peopleWithRelationship = PeopleWithRelationship.find().fetch();
			var personInList = _.find(peopleWithRelationship, function(person){ return person.email == userEmail });

			if (personInList){
				$('.alert-warning').show();
			} else {
				var entityUrl = Session.get('user')._links.self.href;
				var person = People.findOne({email: userEmail});
				var personUrl = person.link;
				Meteor.call('insertPersonOrganizationRelationship', personUrl, entityUrl, 'REQUESTED_FROM_ENTITY',  function(error, response){
					if(!error){
						Meteor.subscribe('getPeopleWithRelationship', Session.get('user').email);
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


$.validator.addMethod('existingUser', function(email){
  let exists = People.findOne({ email: email}, {fields: { email: 1}});
  return exists ? true : false;
});


Template.new_person.events({
	'submit form': function(event){
		event.preventDefault();
	}
});

Template.check_person.events({
	'submit form': function(event){
		event.preventDefault();
	},

	'click .close': function(event){
		event.preventDefault();
		$(event.currentTarget).parent().hide();
	}
})