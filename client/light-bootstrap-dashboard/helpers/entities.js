

/*Template.entities.onDestroyed(function () {
  _.each(this.subscriptions, function (sub) {
    sub.stop();
  });
});*/

Template.my_entities_table.helpers({
	'EntitiesByUser' : function(){
		var entitiesRequestedFromEntities = EntitiesRequestedFromEntities.find().fetch();
		var entitiesRequestedFromUsers = EntitiesRequestedFromUsers.find().fetch();
		var adminEntities = AdminEntities.find().fetch();
		var entitiesAssociated = EntitiesAssociated.find().fetch();

		var entities = entitiesRequestedFromEntities.concat(entitiesRequestedFromUsers)
			.concat(adminEntities).concat(entitiesAssociated);
		return entities;
	}
});

Template.content_entities.onCreated(function(){
	var self = this;
    self.vars = new ReactiveDict();
    self.vars.setDefault('clicked', false); //default is true
});

Template.content_entities.events({
	'click .add-new-element':function(event,template){
    	var instance = Template.instance();
        instance.vars.set('clicked', true); //set to true.
  	},
  	'click .back-to-my-entities': function(event,template){
  		var instance = Template.instance();
  		instance.vars.set('clicked', false);
  	}
})

Template.content_entities.helpers({
	clicked:function(){
 		var instance = Template.instance(); //http://docs.meteor.com/#/full/template_instance
 		return instance.vars.get('clicked'); //this will return false(default) | true
 	}
});


Template.my_entities_table.onRendered(function(){
	this.autorun(function(){
		var userEmail = Session.get('user').email;
		return [
		Meteor.subscribe('getEntitiesRequestedFromEntities', userEmail),
		Meteor.subscribe('getEntitiesRequestedFromUsers', userEmail),
		Meteor.subscribe('getAdminEntities', userEmail),
		Meteor.subscribe('getEntitiesAssociated', userEmail)

		];
	});
});


// NEW ENTITY FORM(S)

Template.new_entity_forms.onRendered(function(){
	this.autorun(function(){
		var userEmail = Session.get('user').email;
		return [
			Meteor.subscribe('getEntities')
		];
	});		
});

Template.form_new_entity.events({
	'submit form': function(event, template){
		event.preventDefault();
		var name = $('[name=name]').val();
		var identifier =$('[name=identifier]').val();
		var description = $('[name=description]').val();
		var email = $('[name=email]').val();
		var entityObject = {
			identifier: identifier,
			name: name,
			description: description,
			email: email
		};
		var userUrl = Session.get('user')._links.self.href;

		Meteor.call('upsertEntity', entityObject, userUrl, function(error, response){
			if (!error){
				Meteor.call('insertPersonOrganizationRelationship', userUrl, response, 
					'ADMINISTRATOR', function(error, response){
						if(!error){
							template.view.parentView.parentView.parentView._templateInstance.vars.set('clicked', false);
						}
					});
			} else {
				console.log('error');
				console.log(error);
			}
		});
	}
});


Template.existing_entity.onRendered(function(){
	$('.check-entity-form').validate({
		rules: {
			entityEmail: {
				existingEntity: true,
				email: true
			}
		},
		messages: {
			entityEmail: {
				existingEntity: 'This email Entity does not exist in our Entity Database. Please verify it email is correct.'
			}
		},
		submitHandler: function(event){		
			var entityEmail = $('[name=entityEmail]').val();
			$('.alert').hide();

			Meteor.call('getEntitiesWithRelationship', Session.get('user').email,
				function(error, response){
					//success
					if(!error){
						var entityInList = _.find(response, function(entity){ 
							return entity.email == entityEmail 
						});

						if (entityInList){
							$('.alert-warning').show();
							$('.alert-warning').fadeTo(5000, 1).slideUp(500, function(){
			          			});
						} else {
							var userUrl = Session.get('user')._links.self.href;
							var entity = Entities.findOne({email: entityEmail});
							var entityUrl = entity.link;
							Meteor.call('insertPersonOrganizationRelationship', userUrl, 
								entityUrl, 'REQUESTED_FROM_USER',  function(error, response){
									if(!error){
										$('.alert-success').show();
										$('.alert-success').fadeTo(5000, 1).slideUp(500, function(){
				          					});
									} else {
										console.log('error in insertPersonOrganizationRelationship');
										console.log(error);
									} 
							});
						}
					}

				});
		}
	});
});


Template.form_new_entity.onRendered(function(){

	$('.alert').hide();

	$('.form-new-entity').validate({
		rules: {
			name: {
				required: true
			},

			email: {
				required: true,
				email: true,
				notExistingEmail: true
			},

			identifier: {
				required: true,
				notExistingIdentifier: true
			}
		},
		messages: {
			email:{
				notExistingEmail: 'This email already exists as an Entity email.'
			},
			identifier:{
				notExistingIdentifier: 'This identifier already exists for another entity.'
			}
		}
	})
});


Template.entities_requested.helpers({
	'EntitiesRequestedFromEntities': function(){
		var entitiesRequestedFromEntities = EntitiesRequestedFromEntities.find().fetch();
		return entitiesRequestedFromEntities;
	},
	'EntitiesRequestedFromUsers': function(){
		var entitiesRequestedFromUsers = EntitiesRequestedFromUsers.find().fetch();
		return entitiesRequestedFromUsers;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.entities_admin.helpers({
	'AdminEntities': function(){
		var adminEntities = AdminEntities.find().fetch();
		return adminEntities;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});

Template.entities_associated.helpers({
	'EntitiesAssociated': function(){
		var entitiesAssociated = EntitiesAssociated.find().fetch();
		return entitiesAssociated;
	},
	'ready': function () {
	    return _.all(Template.instance().subscriptions, function (sub) {
	      return sub.ready();
	    });
	}
});


Template.entities.events({
	'click #newObject' : function(event){
	    event.preventDefault();
	    Router.go('new_entity');
	},
	'click .dissassociate': function(event){
		event.preventDefault();
		var entityId = event.currentTarget.id;
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;
		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			$(event.currentTarget).parent().parent().fadeOut();
		});
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
		Router.go('entity');
	},

	'click .associate-entity' : function(event){
		event.preventDefault();
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('changePersonOrganizationState', response, 'ASSOCIATED');
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			$(event.currentTarget).parent().parent().fadeOut();
		});
	},

	'click .cancel-association-entity' : function(event){
		event.preventDefault();
		var entityEmail = event.currentTarget.name;
		var userEmail = Session.get('user').email;

		Meteor.call('getPersonOrganizationRelationshipByEntityEmailAndPersonEmail', userEmail, entityEmail, function(error, response){
			if(!error){
				Meteor.call('deletePersonOrganizationRelationship', response);
			} else {
				console.log('error in getPersonOrganizationRelationshipByEntityEmailAndPersonEmail');
				console.log(error);
			}
			$(event.currentTarget).parent().parent().fadeOut();
		});
	}
});

$.validator.addMethod('existingEntity', function(email){
	Entities.find().fetch();
  let exists = Entities.findOne({ email: {$regex: new RegExp(email, 'i') } }, {fields: { email: 1}});
  return exists ? true : false;
});

$.validator.addMethod('notExistingEmail', function(email){
  let exists = Entities.findOne({ email: {$regex: new RegExp(email, 'i') } }, {fields: { email: 1}});
  return exists ? false : true;
});

$.validator.addMethod('notExistingIdentifier', function(identifier){
  let exists = Entities.findOne({ identifier: {$regex: new RegExp(identifier, 'i') } }, {fields: { identifier: 1}});
  return exists ? false : true;
});
