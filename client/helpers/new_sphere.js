Template.new_sphere.onRendered(function(){   
  $('#multiselect').multiselect();

  $('.newsphere').validate({
    rules: {
      name: {
        required: true
      },

      description: {
        required: true,
        minlength: 5
      }
    },
    messages: {
      name: {
        required: 'Please type down a Sphere name.'
      },
      description: {
        required: 'Please type down a description.',
        minlength: 'The description must be longer than 5 characters.'
      }
    }

  });
});

Template.sphere_basicinfo.helpers({
  'SphereDetails' : function(){
    return Session.get('sphere');
  },

  'isDataExtracted' : function(option){
    var sphere = Session.get('sphere');
    var isDataExtracted = false;
    if (sphere != null){
      isDataExtracted = sphere.dataextracted;
    }

    if( (isDataExtracted && option == 'write' ) || ( !isDataExtracted && option == 'read') ){
      return 'checked';
    }
    return '';
  }
});

Template.multiSelectConsumers.helpers({
  'consumersArray' : function(){
    return ConsumersByUser.find().fetch();
  },
  'consumersInSphereArray' : function(){
    return ConsumersInSphere.find().fetch();
  }
});

Template.sphere_category.helpers({
  'Categories': function(){   
    var attributesByProviders = AttributesByProviders.find().fetch();

    var attributesArray = [];

    for(a in attributesByProviders){

      var attribute = attributesByProviders[a];
      var category = attribute.category;
      var subcategory = attribute.subcategory;


      var attributeObject = {
        name:       attribute.name,
        enabled:    attribute.enabled,
        link:       attribute.link
      };


      var isCategoryInAttributesArray = false;

      for ( attr in attributesArray ){

        if(attributesArray[attr]['name'] == category){
          //CATEGORY EXISTS
          isCategoryInAttributesArray = true;

          var subcategoriesInArray = attributesArray[attr]['subcategories'];

          var isSubcategoryInAttributesArray = false;

          for (s in subcategoriesInArray){

            if(subcategoriesInArray[s]['name'] == subcategory){
              //SUBCATEGORY EXISTS
              isSubcategoryInAttributesArray = true;

              //ADD ATTRBIUTE TO THE EXISTING SUBCATEGORY
              subcategoriesInArray[s]['attributes'].push(attributeObject)
            }
          }

          if(!isSubcategoryInAttributesArray){
            //SUBCATEGORY DOESN'T EXIST YET
            var subcategoryDict = {};
            subcategoryDict['attributes'] = [];

            //ADD ATTRBIUTE TO THE NEW SUBCATEGORY
            subcategoryDict['attributes'].push(attributeObject);
            subcategoryDict['name'] = subcategory;
            //ADD SUBCATEGORY TO THE EXISTING CATEGORY
            subcategoriesInArray.push(subcategoryDict);
          }
        }
      }

      if (!isCategoryInAttributesArray){
        // CATEGORY DOESN'T EXITS
        // THEREFORE, SUBCATEGORY AND ATTRIBUTE DOESN'T EXIST AS WELL

        var categoryDict = {}
        categoryDict['subcategories'] = [];

        var subcategoryDict = {};
        subcategoryDict['attributes'] = [];

        //ADD ATTRIBUTE TO THE NEW SUBCATEGORY
        //subcategoryDict[subcategory].push(attributeObject);
        subcategoryDict['attributes'].push(attributeObject);
        subcategoryDict['name'] = subcategory;
        //ADD SUBCATEGORY TO THE NEW CATEGORY
        categoryDict['subcategories'].push(subcategoryDict);
        categoryDict['name'] = category;
        //ADD CATEGORY TO THE ARRAY
        attributesArray.push(categoryDict);
      }
    }
    
    //Sort the array
    for (cat in attributesArray){
      for (sub in attributesArray[cat]['subcategories']){
        attributesArray[cat]['subcategories'][sub]['attributes'].sort(compare);
      }
      attributesArray[cat]['subcategories'].sort(compare);
    }
    attributesArray.sort(compare);

    return attributesArray;
  },

  'categoryName': function(){
    for (var name in this){
      return name;     
    }
  }
});

function compare(a,b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else 
    return 0;
}

Template.sphere_attributes.helpers({
  'checkedAttributeSphere' : function(){
    var sphere = Session.get('sphere');
    if (sphere != null){
      var attributesUrl = sphere._links.attributes.href;
      //var attributes = ReactiveMethod.call('getAttributesBySphere', attributesUrl);
      var attributes = AttributesBySphere.find().fetch();

      for (i in attributes){
        var attrUrl = attributes[i].attributesLink;
        if (attrUrl == this.link){
          return 'checked';
        }
      }
    }
    return '';
  }
});

Template.new_sphere.events({
  'submit form' : function(event){
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

    var dataExtracted = $('[name=isDataExtracted]:checked').val();
    var isDataExtracted = dataExtracted == 'true' ? true : false ;

    var sphereObject = {
      identifier : 'xxxx',
      name : $('[name=name]').val(),
      description : $('[name=description]').val(),
      type: $('[name=type]').val(),
      consumers : valuesTo,
      attributes: attrs,
      isEnabled: true,
      isDeleted: false,
      isDataExtracted: isDataExtracted
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

                // Call 5. Join new sphere and consumers selected
                Meteor.call('joinSphereAndConsumer', sphereConsumerUrl, sphereObject.consumers);

                var sphereAttributesUrl = response._links.attributes.href;
                //Call 6. Join Spheres and attributes;
                Meteor.call('joinSphereAndAttributes', sphereAttributesUrl, sphereObject.attributes);

                Router.go('my_spheres');
 
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
        Router.go('my_spheres');
      }
      
    });
  },
  'click .cancel' : function(event) {
    event.preventDefault();
    Router.go('my_spheres');
  }
});

