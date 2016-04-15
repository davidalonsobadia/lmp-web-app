Template.login.onRendered(function(){
  var validator = $('.login').validate({
    submitHandler: function(event){
/*      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
     // Login with Password in MongoDB
      Meteor.loginWithPassword(email, password, function(error){
        if(error){
          if (error.reason == 'User not found'){
            validator.showErrors({
              email: "Email not found."
            });
          } else if (error.reason == 'Incorrect password') {
            validator.showErrors({
              password: "Incorrect password!!"
            });
          }
        } else {
          var currentRoute = Router.current().route.getName();
          if(currentRoute == "login"){
            Router.go("home");
          }
        }
      });
      // End of MongoDb call*/

      // TODO: so far, it does not do anything
      var loginObject = {
        email: $('[name=email]').val(),
        password: $('[name=password]').val()
      };

      Meteor.call('loginWithPassword', loginObject, function(error, response){
        if(! error){
          //success
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