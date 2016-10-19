Template.changePassword.onRendered(function(){
	var validator = $('.change-password').validate({
		rules: {
			password: {
				required: true,
				minlength: 6,
				//TODO: add pattern to Passwords format
				//pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"
			},
			'password-repeat': {
				required: true,
				equalTo: '[name=password]'
			}
		},
		
		messages: {
			password: {
				//pattern: 'Your new password must have a Lowercase character, a Uppercase characterand a Digit.'
			},
			'password-repeat': {
				equalTo: 'Both password fields must have the same value.'
			}
		},
		submitHandler: function(event){
			var password = $('[name=password]').val();
			var email = Router.current().params.query.email;
			var token = Router.current().params.query.token;
			var objectResetPassword = {
				email: email,
				token: token,
				password: password
			}

			Meteor.call('resetAndSavePassword', objectResetPassword, function(error, response){
				if(!error){
					$('.form-col').hide();
					$('.success-message-col').show();
				} else {
					Router.go('login');		
				}
			});
		}
	});
});

Template.changePassword.events({
	'submit form': function(event){
		event.preventDefault();
	}
})

