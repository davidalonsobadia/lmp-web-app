Template.dashboard_sidebar.helpers({
	'isEntity' : function(){
		var person = Session.get('person');
		var user = Session.get('user');

		if (person != null && user != null){
			if(person.identifier === user.identifier){
				return false;
			} else {
				return true;
			}
		}
		return true;
	}
});

Template.dashboard_entity_sidebar.helpers({
	'entity' : function(){
		return Session.get('user');
	}
})

Template.dashboard_entity_sidebar.events({
	'click .back_to_user' : function(event){
		event.preventDefault();
		Session.setPersistent('user', Session.get('person'));
		Router.go('user');
	}
})

Template.dashboard_navbar.events({
  'click .logout': function(event){
    event.preventDefault();
    Session.setPersistent('person', null);
    Session.setPersistent('user', null);
    Router.go('/');
  }
});

Template.dashboard_navbar.helpers({
	'user': function(){
		return Session.get('person');
	}
});