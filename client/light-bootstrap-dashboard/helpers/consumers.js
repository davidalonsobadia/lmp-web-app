Template.my_consumers_table.helpers({
  'ConsumersByUser' : function(){
    return ConsumersByUser.find({}, {sort: {name: 1}});
  }
});

Template.my_consumers_table.events({
	'click .delete-consumer': function(event){
		event.preventDefault();
		var consumersUrl = Session.get('user')._links.consumers.href;
		Meteor.call('getConsumersByUser', consumersUrl, 
			function(error, response){
				if(!error){
					var consumers = [];
					_.each(response, function(consumer){
						if(event.currentTarget.id != consumer._links.self.href)
							consumers.push(consumer._links.self.href);
					})
					var urlPerson = Session.get('user')._links.consumers.href;
	      			Meteor.call('joinPersonAndConsumer', urlPerson, consumers);
				}
				$(event.currentTarget).parent().parent().fadeOut();
		});
	}
});

Template.new_consumers_table.events({
	'click .add-consumer': function(event){
		event.preventDefault();
		var consumersUrl = Session.get('user')._links.consumers.href;
		Meteor.call('getConsumersByUser', consumersUrl,
			function(error, response){
				if(!error){
					var consumers = [];
					_.each(response, function(consumer){
						consumers.push(consumer._links.self.href);
					})
					consumers.push(event.currentTarget.id);
					var urlPerson = Session.get('user')._links.consumers.href;
	      			Meteor.call('joinPersonAndConsumer', urlPerson, consumers);
				}
				$(event.currentTarget).parent().parent().fadeOut();
		});
	}
})

Template.content_consumers.onCreated(function(){
	var self = this;
    self.vars = new ReactiveDict();
    self.vars.setDefault('clicked', false); //default is true
});

Template.my_consumers_table.onRendered(function(){
	this.autorun(function(){
		var consumersUrl = Session.get('user')._links.consumers.href;
		return Meteor.subscribe('getConsumersByUser', consumersUrl);
	});
});

Template.new_consumers_table.onRendered(function(){
	this.autorun(function(){
		var consumersUrl = Session.get('user')._links.consumers.href;
		return [ 
			Meteor.subscribe('getConsumers'),
			Meteor.subscribe('getConsumersByUser', consumersUrl)
		];
	});
});

Template.new_consumers_table.helpers({
	'Consumers' : function(){
		return Consumers.find({}, {sort: {name: 1}}).fetch();
	},
	'ConsumersByUser' : function(){
		return ConsumersByUser.find({}, {sort: {name: 1}}).fetch();
	}
});

Template.content_consumers.helpers({
	clicked:function(){
 		var instance = Template.instance(); //http://docs.meteor.com/#/full/template_instance
 		return instance.vars.get('clicked'); //this will return false(default) | true
 	}
});

Template.content_consumers.events({
	'click .add-new-element':function(event,template){
    	var instance = Template.instance();
        instance.vars.set('clicked', true); //set to true.
  	},
  	'click .back-to-my-providers': function(event,template){
  		var instance = Template.instance();
  		instance.vars.set('clicked', false);
  	}
});

