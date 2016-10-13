Template.index.onRendered(function(){
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
          Router.go('user');
        } else {
          console.log('An error happens...');
          console.log(error);

          validator.showErrors({
            password: "Your email or password is incorrect."
          });
        }
      });
    }
  });
});

Template.index.events({
  'submit form': function(event){
    event.preventDefault();
  }
});