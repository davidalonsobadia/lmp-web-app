Template.consumersByUser.helpers({
  'Consumers' : function(){
    //return Providers.find();
    var user = Session.get('user');
    var consumersUrl = user._links.consumers.href;
    return ReactiveMethod.call('getConsumersbyPerson', consumersUrl);
  }
});

Template.consumers.events({
  'click #newObject' : function(event){
    event.preventDefault();
    Router.go('newConsumer');
  },
  'click .delete-consumer' : function(event){
    event.preventDefault();

    var user = Session.get('user');
    var urlPersonConsumer = user._links.consumers.href;

    consumerIdToDelete = event.currentTarget.id;

    var consumersUrl = $("[name=delete-button]").map(
      function(){
        return $(this).attr('id');
    })
    .get();

    for(p in consumersUrl){
      if(consumersUrl[p] == consumerIdToDelete){
        consumersUrl.splice(p, 1);
      }
    }

    Meteor.call('joinPersonAndConsumer', urlPersonConsumer, consumersUrl);

    window.location.reload(true);
  }
});

Template.consumer.events({
  'click .save-changes': function(event){
    event.preventDefault();
    var consumers = $("[name=consumer]").map(
      function(){
        if($(this).is(":checked")){
          return $(this).attr('id');
        }
      })
    .get();

    var urlPerson = Session.get('user')._links.consumers.href;
    Meteor.call('joinPersonAndConsumer', urlPerson, consumers);

    Router.go('consumers');
  },

  'click .cancel' : function(event) {
    event.preventDefault();
    Router.go('consumers');
  }
});

Template.consumersList.helpers({
  'Consumers' : function(){
    //return ReactiveMethod.call('getConsumers');
    console.log(Consumers.find());
    return Consumers.find();
  },
  'checkedConsumers': function(){
    // 1. get the provider identifier (here we will use name)
    var name = this.name;

    // 1.5 get all the providers so far activated by the user
    var user = Session.get('user');
    var consumersUrl = user._links.consumers.href;
    var consumers = ReactiveMethod.call('getConsumersbyPerson', consumersUrl);

    // 2. check if the provider identifier is on the person providers list.
    for( p in consumers){
      // return either checked or '' depending on the previous result.
      if(consumers[p].name == this.name){
        return 'checked'
      }
    }
    return '';
  }
});

Template.consumersList.events({
  'change [name=select-all]': function(event){
    event.preventDefault();
    if(event.currentTarget.checked) {
      // Iterate each checkbox
      $('[name=consumer]').each(function() {
          this.checked = true;                        
      });
    } else {
      $('[name=consumer]').each(function() {
          this.checked = false;                        
      });
    }
  }
});

