Template.dataspheres.events({
  'click #newObject' : function(event){
    event.preventDefault();
    Session.setPersistent('sphere', null);
    Router.go('newSphere');
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
      Router.go('newSphere');
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
    var user = Session.get('user');
    var urlPersonSpheres = user._links.spheres.href;
    return ReactiveMethod.call('getSpheresByPerson', urlPersonSpheres);
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

Template.sphere_basicinfo.helpers({
  'SphereDetails' : function(){
    return Session.get('sphere');
  }
});


Template.sphere.onRendered(function(){   
  $('#multiselect').multiselect();
});

Template.sphere.events({
  'click .save-changes' : function(event){
    event.preventDefault();
    var valuesFrom = $("[name=from] option").map(
      function() { 
        return $(this).attr('id'); 
      })
      .get();
    var valuesTo = $("[name=to] option").map(
      function() { 
        return $(this).attr('id'); 
      }).get();
    var attrs = $("[name=attr]").map(
      function(){
        if($(this).is(":checked")){
          return $(this).attr('id');
        }
      })
    .get();

    console.log(attrs);

    var sphereObject = {
      identifier : 'xxxx',
      name : $('[name=label]').val(),
      description : $('[name=description]').val(),
      type: $('[name=type]').val(),
      consumers : valuesTo,
      attributes: attrs,
      isEnabled: true,
      isDeleted: false
    };

    var httpCommand = 'POST';
    if (Session.get('sphere') != null){
      sphereObject.url = Session.get('sphere')._links.self.href;
      httpCommand = 'PUT';
    }

    // Call 1. Create the sphere Object
    Meteor.call('upsertSphere', sphereObject, httpCommand, function(error, response){
      if (! error){
        //succed
        var sphereUrl = response.headers.location;
        var user = Session.get('user');
        var urlSpherePerson = user._links.spheres.href;

        // Call 2. get the Spheres of the Person who created the sphere.
        Meteor.call('getSpheresByPerson', urlSpherePerson, function(error, response){
          if(!error){
            //succeed
            var sphereUrls = [];
            for(s in response){
              sphereUrls.push(response[s]._links.self.href);
            }

            if(httpCommand == 'POST'){
              sphereUrls.push(sphereUrl);
            }

            // Call 3. Join new spheres and user.
            Meteor.call('joinPersonAndSphere', urlSpherePerson, sphereUrls, function(error, response){
              if(!error){
                //succeed
              } else {
                console.log(error);
              }
            });

            // Call 4. Get the sphere we have already created.
            Meteor.call('getSphere', sphereUrl, function(error, response){
              if(!error){
                //succeed
                var sphereConsumerUrl = response._links.consumers.href;

                Router.go('dataspheres');

                // Call 5. Join new sphere and consumers selected
                Meteor.call('joinSphereAndConsumer', sphereConsumerUrl, sphereObject.consumers);

                var sphereAttributesUrl = response._links.attributes.href;
                //Call 6. Join Spheres and attributes;
                Meteor.call('joinSphereAndAttributes', sphereAttributesUrl, sphereObject.attributes);

              } else {
                console.log(error);
              }
            });

          } else {
            console.log(error);
          }
        });        
      } else {
        console.log(error);
        Router.go('dataspheres');
      }
      
    });
  },
  'click .cancel' : function(event) {
    event.preventDefault();
    Router.go('dataspheres');
  }
});

Template.multiSelectConsumers.helpers({
  'consumersArray' : function(){
    var user = Session.get('user');
    var consumersUrl = user._links.consumers.href;
    return ReactiveMethod.call('getConsumersbyPerson', consumersUrl);

  },
  'consumersInSphereArray' : function(){
    var sphere = Session.get('sphere');
    if( sphere != null){
      var sphereConsumerUrl = sphere._links.consumers.href;
      return ReactiveMethod.call('getConsumersInSphere', sphereConsumerUrl);
    }
    return [];
  }
});

Template.sphere_category.helpers({
  'Categories' : function(){
    var user = Session.get('user');
    var providersUrl = user._links.providers.href;
    var providers = ReactiveMethod.call('getProvidersbyPerson', providersUrl);
    var providerNames = [];
    for ( i in providers){
      providerNames.push(providers[i].name);
    }

    if(providerNames.length > 0){
      //var categoriesArray = ReactiveMethod.call('getCategoriesByProviders', providerNames);

      var attributes = ReactiveMethod.call('getAttributesByProviders', providerNames);

      var attributesDict = {};
      attributesDict.categories = {};

      for ( i in attributes) {

        var attribute = attributes[i];
        
        var category = attribute.subcategory.category.name;
        var subcategory = attribute.subcategory.name;
        var attributeName = attribute.name;
        var enabled = false;
        var link = attribute._links.self.href;

        var attributeObject = {
          name: attributeName,
          enabled: enabled,
          link: link
        };

        if(attributesDict.categories[category] != undefined){

          if(attributesDict.categories[category][subcategory] != undefined){
            attributesDict.categories[category][subcategory].push(attributeObject);
          } else {
            attributesDict.categories[category][subcategory] = [];
            attributesDict.categories[category][subcategory].push(attributeObject);
          }
        } else {
          attributesDict.categories[category] = {};
          attributesDict.categories[category][subcategory] = [];
          attributesDict.categories[category][subcategory].push(attributeObject);
        }
      }
      // -- END for

      var k = $.map(attributesDict.categories, function(subcategories, nameCategory){
        var cat = {}
        cat[nameCategory] = subcategories;
        return cat;
      });

      return k;

    } else {
      console.log('No Providers added for this user, therefore there is not attributes shown');
      return [];
    }
    return [];
  },

  'categoryName': function(){
    for (var name in this){
      return name;     
    }
  }
});

Template.sphere_subcategories.helpers({
  'Subcategories': function(){

    var subcategories = [];

    for (objectCategory in this){
      var category = this[objectCategory];

      for (subcategory in category){
        var dictSubcategory = {};
        dictSubcategory[subcategory] = category[subcategory];
        subcategories.push(dictSubcategory);
      }
    }
    return subcategories;
  },

  'subcategoryName': function(){
    for (title in this){
      return title;
    }
  }
});

Template.sphere_attributes.helpers({
  'attributes' : function(){
    for (a in this){
      return this[a];
    }
  },
  'checkedAttributeSphere' : function(){

/*    console.log(this);
    console.log(this.enabled);*/

    var sphere = Session.get('sphere');
    var attributesUrl = sphere._links.attributes.href;

    var attributes = ReactiveMethod.call('getAttributesBySphere', attributesUrl);


    for (i in attributes){
      var attrUrl = attributes[i]._links.self.href;
      if (attrUrl == this.link){
        return 'checked';
      }
    }

    return '';

/*
    // get attributes of sphere   
    var sphereAttributes = Spheres.find({}, {fields: {checkedAttributes: 1}}).fetch()[0];
    // get the particular attributes name
    var attrName =  this.name;
    //loop the list of attributes in the sphere
    if(sphereAttributes != null) {
      for (var i in sphereAttributes.checkedAttributes) {
        // if name is in the attributes list of the sphere:
        if (sphereAttributes.checkedAttributes[i] == attrName){
          // return checked
          return "checked";
        }
      }
    }
    // if not, return ""
    return "";*/
  }
});


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