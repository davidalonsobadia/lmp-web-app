Template.login.onRendered(function(){
  var validator = $('.login').validate({
    submitHandler: function(event){
      var loginObject = {
        email: $('[name=email]').val(),
        password: $('[name=password]').val()
      };

      Meteor.call('loginWithPassword', loginObject, function(error, response){
        if(! error){
          //success
          Session.setPersistent('person', response);
          Session.setPersistent('user', response);
          Router.go('home');
        } else {
          console.log('An error happens...');
          console.log(error);
          if (error.reason == 'User not found'){
            validator.showErrors({
                email: "Email not found."
              });
          } else if (error.reason == 'Incorrect password') {
            validator.showErrors({
              password: "Incorrect password!!"
            });
          }
        }
      });
    }
  });
});

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
  }
});