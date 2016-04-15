Template.navbar.events({
  'click .logout': function(event){
    event.preventDefault();
    //Meteor.logout();

    Session.setPersistent('user', null);

    Router.go('login');
  }
});