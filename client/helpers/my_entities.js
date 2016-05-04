Template.my_entities.onRendered(function(){
	var user = Session.get('user');
	var entitiesLink = user._links.entities.href;
	this.subscriptions = [
		Meteor.subscribe('getEntitiesByUser', entitiesLink)
		];
});

Template.my_entities.onDestroyed(function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
});


Template.entitiesByUser.helpers({
	'Entities': function(){
		return EntitiesByUser.find();
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.my_entities.events({
	'click #newObject' : function(event){
	    event.preventDefault();
	    Router.go('new_entity');
	},

	'click .delete-entity' : function(event){
		event.preventDefault();
		var user = Session.get('user');
	    var urlPersonEntities = user._links.entities.href;
    	entityIdToDelete = event.currentTarget.id;

	    var entitiesUrl = $("[name=delete-button]").map(
	      function(){
	        return $(this).attr('id');
	    })
	    .get();

	    for(e in entitiesUrl) {
	      if(entitiesUrl[e] == entityIdToDelete) {
	        entitiesUrl.splice(e, 1);
	      }
	    }

	    Meteor.call('joinPersonAndEntities', urlPersonEntities, entitiesUrl);

	    Meteor.call('deleteEntity', entityIdToDelete);

	    window.location.reload(true);
	},

	'click .use-entity' : function(event){
		event.preventDefault();

		var entityUrl = event.currentTarget.id;
		Meteor.call('getEntity', entityUrl, function(error, response){
			if(!error){
				Session.setPersistent('user', response);
			} else {
				console.log('An error ocurred while trying to get the entity');
				console.log(error);
			}
		});

		//Session.set('')

		Router.go('home');
	}
});