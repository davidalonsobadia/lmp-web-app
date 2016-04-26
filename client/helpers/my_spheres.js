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

  'change [type=checkbox]': function(){
    var enabledObject = {
      documentId : this._id,
      isEnabled : !this.enabled
    };
    // TODO: call
    Meteor.call('updateSphereEnabled', enabledObject);
  }
});

Template.spheresTable.helpers({
  'Spheres' : function(){
    return SpheresByUser.find().fetch();
  },
  'checkedObject' : function(){
    var isEnabled = this.enabled;
    if(!isEnabled){
      return "checked";
    } else {
      return "";
    }
  }
});


// Common helpers
Template.registerHelper('arrayDifference', function(array1, array2){
  var array1Names = [];
  var array2Names = [];

  if(array1 != undefined && array1 != null && array1.length > 0){
    for (i in array1){
      array1Names.push(array1[i].name);
    }
  }

  if(array2 != undefined && array2 != null && array2.length > 0){
    for (j in array2){
      array2Names.push(array2[j].name);
    }   
  }

  var arrayNamesDiff = $(array1Names).not(array2Names).get();
  var arrayDiff = [];

  for (objectIndex in array1){
    var name = array1[objectIndex].name;

    for (arrayNameIndex in arrayNamesDiff){

      if ( name == arrayNamesDiff[arrayNameIndex]){
        arrayDiff.push(array1[objectIndex]);
      }

    } 
  }
  return arrayDiff;

});