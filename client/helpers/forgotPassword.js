Template.forgotPassword.onRendered(function(){
	var validator = $('.forgot-password').validate({
		rules: {
			email: {
				required: true,
				emailRegistered: true
			}
		},
		
		messages: {
			email: {
				emailRegistered: 'Email not found in our Database'
			}
		},
		submitHandler: function(event){
			var email = $('[name=email]').val();
			Meteor.call('sendEmailResetPassword', email, function(error, response){
				if(!error){
					$('.forgot-col').hide();
					$('.forgot-password-message').show();
				}else {
					Router.go('login');
				}
			});
		}
	});
});

Template.forgotPassword.events({
	'submit form': function(event){
		event.preventDefault();
	}
})


$.validator.addMethod( 'emailRegistered', function(email){
  let exists = RegisteredEmails.findOne({ email: email}, {fields: { email: 1}});
  return exists ? true : false;
});