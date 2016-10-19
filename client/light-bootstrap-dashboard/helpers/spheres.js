Template.my_spheres_table.helpers({
  'SpheresByUser' : function(){
    return SpheresByUser.find({}, {sort: {name: 1}});
  }
});

Template.my_spheres_table.events({
	'click .delete-sphere': function(event){
		event.preventDefault();
		var spheresUrl = Session.get('user')._links.spheres.href;
		Meteor.call('getSpheresByUser', spheresUrl, 
			function(error, response){
				if(!error){
					var spheres = [];
					_.each(response, function(sphere){
						if(event.currentTarget.id != sphere._links.self.href)
							spheres.push(sphere._links.self.href);
					})
					var urlPerson = Session.get('user')._links.spheres.href;
	      			Meteor.call('joinPersonAndSphere', urlPerson, spheres);
				} else {
					console.log('error in getSpheresByUser');
					console.log(error);
				}
				$(event.currentTarget).parent().parent().fadeOut();
		});
	},
	'click .edit-sphere' : function(event, template){
	    event.preventDefault();
	    var urlSphere = event.currentTarget.id;  
	    Meteor.call('getSphere', urlSphere, function(error, response){
	      if(!error){
	        //succeed
	        Session.setPersistent('sphere', response);
	      } else {
	        console.log(error);
	      }
	      template.view.parentView.parentView._templateInstance.vars.set('clicked', true);
	    });
  	},
});

//TODO: check late
Template.new_spheres_form.events({
	'click .add-sphere': function(event){
		event.preventDefault();
		var spheresUrl = Session.get('user')._links.spheres.href;
		Meteor.call('getSpheresByUser', spheresUrl,
			function(error, response){
				if(!error){
					var spheres = [];
					_.each(response, function(sphere){
						spheres.push(sphere._links.self.href);
					})
					spheres.push(event.currentTarget.id);
					var urlPerson = Session.get('user')._links.spheres.href;
	      			Meteor.call('joinPersonAndSphere', urlPerson, spheres);
				}
				$(event.currentTarget).parent().parent().fadeOut();
		});
	}
})

Template.content_spheres.onCreated(function(){
	var self = this;
    self.vars = new ReactiveDict();
    self.vars.setDefault('clicked', false); //default is true
});

Template.my_spheres_table.onRendered(function(){
	this.autorun(function(){
		var spheresUrl = Session.get('user')._links.spheres.href;
		return Meteor.subscribe('getSpheresByUser', spheresUrl);
	});
});

Template.new_spheres_form.onRendered(function(){
	this.autorun(function(){
		$('#multiselect').multiselect();

		var user = Session.get('user');
	    var providersUrl = user._links.providers.href;
	    var consumersUrl = user._links.consumers.href;
	    var attributes = Attributes.find().fetch();
	    var providers = ProvidersByUser.find().fetch();
	    var providerLinks = [];
	    var providerNames = [];

	    for (p in providers){
	      var provider = providers[p];
	      var providerLink = provider.attributesLink;
	      providerLinks.push(providerLink);
	      providerNames.push(provider.name);
	    }

	    var sphere = Session.get('sphere');
	    var sphereAttributesUrl = null;
	    var sphereConsumerUrl = null;
	    if(sphere != null){
	      sphereAttributesUrl = sphere._links.attributes.href; 
	      sphereConsumerUrl = sphere._links.consumers.href; 
	    }

	    var sphereUserUrl = user._links.spheres.href;

	    return [ Meteor.subscribe('getProvidersByUser', providersUrl)
	      , Meteor.subscribe('getAttributesByProviders', providerNames)
	      , Meteor.subscribe('getAttributesBySphere', sphereAttributesUrl)
	      , Meteor.subscribe('getConsumersByUser', consumersUrl)
	      , Meteor.subscribe('getConsumersInSphere',  sphereConsumerUrl)
	      ];

	});
});

Template.content_spheres.helpers({
	clicked:function(){
 		var instance = Template.instance(); //http://docs.meteor.com/#/full/template_instance
 		return instance.vars.get('clicked'); //this will return false(default) | true
 	}
});

Template.content_spheres.events({
	'click .add-new-element':function(event,template){
    	var instance = Template.instance();
        Session.setPersistent('sphere', null); // reset sphere data
        instance.vars.set('clicked', true); //set to true.
  	},
  	'click .back-to-my-providers': function(event,template){
  		var instance = Template.instance();
  		instance.vars.set('clicked', false);
  	}
});


Template.new_sphere_basicinfo.helpers({
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

Template.new_sphere_multiselect_consumers.helpers({
	'consumersByUser': function(){
		return ConsumersByUser.find().fetch();
	},
	'consumersInSphere': function(){
		return ConsumersInSphere.find().fetch();
	}
});

Template.new_sphere_category.helpers({
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

Template.new_sphere_attributes.helpers({
  'checkedAttributeSphere' : function(){
    var sphere = Session.get('sphere');
    if (sphere != null){
      var attributesUrl = sphere._links.attributes.href;
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

Template.content_spheres.events({
  'submit form' : function(event, template){
    event.preventDefault();
    console.log('HEY IN SUBMIT fadeOutRM');
    var valuesFrom = $("[name=from] option").map(
      function() { 
        return $(this).attr('id'); 
      })
      .get();
    var valuesTo = $("[name=to] option").map(
      function() {
        console.log(this); 
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

    console.log(valuesTo);

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

                Meteor.call('joinSphereAndAttributes', sphereAttributesUrl, 
                	sphereObject.attributes, function(error, response){

                		// TO GO TO SPHERES TABLE PAGE
                		template.vars.set('clicked', false)
                });
 
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
      }
     	      
    });
  },
  'click .cancel' : function(event, template) {
    event.preventDefault();
    template.vars.set('clicked', false);
  }
});


//HELPER FUNCTIONS

function compare(a,b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else 
    return 0;
}