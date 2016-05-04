Template.navbar.events({
  'click .logout': function(event){
    event.preventDefault();
    Session.setPersistent('person', null);
    Session.setPersistent('user', null);
    Router.go('login');
  }
});

Template.navbar.helpers({
	'firstName': function(){
		var person = Session.get('person');
		if (person){
			return person.name;	
		}
		return null;
		
	}
})