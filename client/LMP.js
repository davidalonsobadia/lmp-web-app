Template.register.onRendered(function(){
  var validator = $('.register').validate({
    submitHandler: function(event){
      var name = $('[name=firstName]').val();
      var surname = $('[name=lastName]').val();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();

/*      // -- This code goes to MongoDB. Remove later 
      Accounts.createUser({
        email: email,
        password: password,
        profile: {
          'name': name,
          'surname': surname,
        }
      }, function(error){
        if(error){
          console.log(error.reason);
        } else {
          Router.go('login');
        }
      });
      // -- End of MongoDB code*/

      var personObject = {
        name : name,
        surname : surname,
        email : email,
        password: password
      };

      Meteor.call('registerUser', personObject);

      Router.go('login');
    }
  });
});

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

Template.navbar.events({
  'click .logout': function(event){
      event.preventDefault();
      //Meteor.logout();

      // TODO: logout in session...
      Session.setPersistent('user', null);

      Router.go('login');
    }
  });



// Custom Helpers

Template.registerHelper('compare', function(v1, v2) {
  if (typeof v1 === 'object' && typeof v2 === 'object') {
    return _.isEqual(v1, v2); // do a object comparison
  } else {
    return v1 === v2;
  }
});


