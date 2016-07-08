Template.register.onRendered(function(){
  var validator = $('.register').validate({

    rules : {
      firstName: {
        required: true,
        minlength: 3
      },

      lastName: {
        required: true,
        minlength: 3
      },

      email: {
        required: true,
        email: true,
        emailUnique: true
      },

      phone: {
        required: true,
        number: true
      },

      personal_id: {
        required: true,
        personalIdUnique: true
      },

      password: {
        required: true,
        minlength: 6
      },

      'password-confirm': {
        required: true,
        equalTo: '[name=password]'
      }

    },

    messages: {
      email: {
        emailUnique: 'This user already exists!'
      },
      phone: {
        number: 'This is not a valid Phone Number. Please introduce your phone number only with digits, without any spaces.'
      },
      personal_id: {
        personalIdUnique: 'This personal Id already exists!'
      },
      'password-confirm': {
        equalTo: 'Both password fields must have the same value.'
      }
    },

    submitHandler: function(event){
      var name = $('[name=firstName]').val();
      var surname = $('[name=lastName]').val();
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      var phone = $('[name=phone]').val();
      var personal_id = $('[name=personal_id]').val();

      var identifier = email.hashCode();

      var personObject = {
        identifier : identifier,
        name : name,
        surname : surname,
        phone: phone,
        email : email,
        personal_id: personal_id,
        password: password
      };

      Meteor.call('registerUser', personObject);

      Router.go('login');
    }
  });
});

$.validator.addMethod( 'emailUnique', function(email){
  let exists = RegisteredEmails.findOne({ email: email}, {fields: { email: 1}});
  return exists ? false : true;
});

$.validator.addMethod( 'personalIdUnique', function(personal_id){
  let exists = RegisteredIds.findOne({ personal_id: personal_id}, {fields: { personal_id: 1}});
  return exists ? false : true;
});