Template.my_spheres.events({
  'click #newObject' : function(event){
    event.preventDefault();
    Session.setPersistent('sphere', null);
    Router.go('new_sphere');
  },

  'click .edit-sphere' : function(event){
    event.preventDefault();
    var urlSphere = event.currentTarget.id;  
    Meteor.call('getSphere', urlSphere, function(error, response){
      if(!error){
        //succeed
        Session.setPersistent('sphere', response);
      } else {
        console.log(error);
      }
      Router.go('new_sphere');
    });
  },

  'click .delete-sphere' : function(event){
    event.preventDefault();
    var documentId = this._id;
    var user = Session.get('user');
    var urlPersonSpheres = user._links.spheres.href;

    SphereIdToDelete = event.currentTarget.id;
    var spheresUrl = $("[name=delete-button]").map(
      function(){
        return $(this).attr('id');
    })
    .get();

    for(p in spheresUrl){
      if(spheresUrl[p] == SphereIdToDelete){
        spheresUrl.splice(p, 1);
      }
    }
    Meteor.call('joinPersonAndSphere', urlPersonSpheres, spheresUrl);
    window.location.reload(true);
  },

  'change [type=checkbox]': function(event){
    event.preventDefault();
    var enabledObject = {
      documentId : this._id,
      isEnabled : !this.enabled
    };
    var enabled = event.currentTarget.checked;
    var sphereUrl = event.currentTarget.id;
    Meteor.call('updateSphereEnabled', enabled, sphereUrl);
  }
});

Template.spheresTable.helpers({
  'Spheres' : function(){
    return SpheresByUser.find({}, {sort: {name: 1}}).fetch();
  },
  'checkedObject' : function(){
    var isEnabled = this.enabled;
    if(isEnabled){
      return "checked";
    } else {
      return "";
    }
  }
});
