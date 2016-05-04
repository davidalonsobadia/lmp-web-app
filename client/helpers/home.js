Template.home.helpers({
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

Template.entity_message.helpers({
	'user' : function(){
		return Session.get('user');
	}
})

Template.entity_message.events({
	'click .back_to_user' : function(event){
		event.preventDefault();
		Session.setPersistent('user', Session.get('person'));
	}
})


