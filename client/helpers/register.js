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