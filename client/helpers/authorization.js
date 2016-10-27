Template.authorization.onRendered(function(){

	var provider = Session.get('provider');
	Session.setPersistent('provider', null);
	var email = Session.get('user').email;
	var code = Router.current().params.query.code;

	var authorizationData = {
		provider: provider,
		email: email,
		code: code
	}

	Meteor.call('getToken', authorizationData, function(error, response){
		if(!error){
			console.log(response);
			Router.go('providers');
		} else {
			console.log('error in getToken');
			console.log(error);
		}
	});

});