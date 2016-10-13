Template.content_user_profile.onRendered(function(){
	$('.profile').validate({
		rules: {
			firstName: {
	        	required: true,
	        	minlength: 3
	      	},

	      	lastName: {
	        	required: true,
	        	minlength: 3
	      	},

	      	phone: {
	       		required: true,
	        	number: true
	      	}
		},
		messages:{
			firstName: {
	        	required: 'You cannot let your First Name empty!'
	      	},

	      	lastName: {
	        	required: 'You cannot let your Last Name empty!'
	      	},

	      	phone: {
	       		required: "Phone Number can't be empty!",
	       		number: 'This is not a valid Phone Number. Please introduce your phone number only with digits, without any spaces.'
	      	}
		}
	});
});

Template.content_user_profile.events({
	'submit form': function(event){
		event.preventDefault();
		console.log('here in submit form');
		var userSession = Session.get('user');
		var user = {
			name: 			$("[name=firstName]").val(),
			surname: 		$("[name=lastName]").val(),
			//email:          $("[name=email]").val(),
			phone: 			$("[name=phone]").val(),
			identifier: 	$("[name=identifier]").val(),
			address: 		$("[name=address]").val(),
			postalCode:     $("[name=postalCode]").val(),
			city:    		$("[name=city]").val(),
			country:   		$("[name=country]").val(),
			description:    $("[name=description]").val(),

			link: 			userSession._links.self.href,
			password: 		userSession.password,
			personal_id: 	userSession.personal_id,
			email: 			userSession.email
		};

		Meteor.call('updateUser', user, function(error, response){
			if (!error){
			    var loginObject = {
		       		email: user.email,
		        	password: user.password
		      	};

		      	Meteor.call('loginWithPassword', loginObject, function(error, response){
		        	if(! error){
						Session.setPersistent('user', response);
						Session.setPersistent('person', response);
					} else {
						console.log('error in updateUser - loginWithPassword');
						console.log(error);
					}
				});

			} else {
				console.log('error in updateUser');
				console.log(error);
			}
		});
	},

	'click .btn-danger': function(event){
		event.preventDefault();
		Router.go('home');
	}
});