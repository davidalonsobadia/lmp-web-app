



Meteor.methods({

/*  'getUserId' : function(){
    return Meteor.userId();
  },*/
  'upsertSphere' : function(sphereObject, httpCommand){
/*    Spheres.upsert({
      //Query
      _id: sphereObject.sphereId
    }, {
      //Modifier
      $set: {
        userId :            Meteor.userId(),
        label :             sphereObject.label,
        description :       sphereObject.description,
        consumers :         sphereObject.consumers,
        createdAt :         sphereObject.createdAt,
        checkedAttributes:  sphereObject.checkedAttributes,
        enabled:            sphereObject.enabled
      }
    });*/

    if(httpCommand == 'POST'){
      var url = localhost + slash + spheres;
      var response = HTTP.post(url, {
        data: {
          identifier:         sphereObject.identifier,
          name:               sphereObject.name,
          description:        sphereObject.description,
          type:               sphereObject.type,
          isEnabled:          sphereObject.isEnabled,
          isDeleted:          sphereObject.isDeleted
        }
      });
      return response;

    } else {
      var response = HTTP.put(sphereObject.url, {
        data: {
          identifier:         sphereObject.identifier,
          name:               sphereObject.name,
          description:        sphereObject.description,
          type:               sphereObject.type,
          isEnabled:          sphereObject.isEnabled,
          isDeleted:          sphereObject.isDeleted
        }
      });
      return response;

    }

  },

  'joinSphereAndConsumer': function(sphereConsumerUrl, consumersUrl){
    var urlConsumersString = '';
    for (url in consumersUrl){
      urlConsumersString += consumersUrl[url] + '\n'
    }

    return HTTP.put(sphereConsumerUrl, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlConsumersString
    });
  },

  'joinSphereAndAttributes': function(sphereAttributesUrl, attributesUrl){

    console.log(attributesUrl);
    console.log(sphereAttributesUrl);
    var urlAttributesString = '';
    for (url in attributesUrl){
      urlAttributesString += attributesUrl[url] + '\n'
    }

    return HTTP.put(sphereAttributesUrl, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlAttributesString
    });

  },

  'upsertProvider' : function(providerObject){
/*    Providers.upsert({
      _id: providerObject.providerId
    }, {
      $set: {
        userId:             Meteor.userId(),   
        name:               providerObject.name,
        description:        providerObject.description,
        url:                providerObject.url,
        attributes:         providerObject.attributes,
        createdAt:          providerObject.createdAt,
        checkedAttributes:  providerObject.checkedAttributes,
        enabled:            providerObject.enabled
      }
    });*/

/*    var url = localhost + slash + providers;
    var response = HTTP.post(url, {
      data: {
        identifier:         providerObject.identifier,
        name:               providerObject.name,
        description:        providerObject.description,
        url:                providerObject.url,
        isEnabled:          providerObject.isEnabled,
        isDeleted:          providerObject.isDeleted
      }
    });

    var urlNewProvider = response.headers.location;

    var urlAssociation = urlNewProvider + slash + person;
    console.log('urlAssociation: ' + urlAssociation);
    console.log('urlPerson: ' + urlPerson)

    var response2 = HTTP.put(urlAssociation, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlPerson
    });
    return response;*/

/*    var url = localhost + slash + providers;
    var response = HTTP.post(url, {
      data: {
        identifier:         providerObject.identifier,
        name:               providerObject.name,
        description:        providerObject.description,
        url:                providerObject.url,
        enabled:            providerObject.isEnabled,
        deleted:            providerObject.isDeleted,
        person:             urlPerson 
      }
    });*/

// TODO: SE TENDRÁ UNA LISTA DE PROVEEDORES. CUANDO ESTA LISTA ESTÉ LISTA, SE ELEGIRÁ UN PROVEEDOR
// Y ESE QUEDARÁ VINCULADO AL USUARIO QUE HA HECHO ESA ACCIÓN. LA ACCIÓN QUEDARÁ ASOCIADA CON EL MÉTODO PUT
// SIGUIENDO ESTA RESPUESTA: http://stackoverflow.com/questions/17981252/how-to-update-reference-object-in-spring-data-rest?rq=1

    var url = localhost + slash + providers;
    var response = HTTP.post(url, {
      data: {
        identifier:         providerObject.identifier,
        name:               providerObject.name,
        description:        providerObject.description,
        url:                providerObject.url,
        isEnabled:          providerObject.isEnabled,
        isDeleted:          providerObject.isDeleted
      }
    });
    return response;
  },

  'joinPersonAndProvider': function(urlProviderPerson, urlProviders){

    var urlProvidersString = '';
    for (url in urlProviders){
      urlProvidersString += urlProviders[url] + '\n'
    }

    return HTTP.put(urlProviderPerson, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlProvidersString
    });
  },

  'joinPersonAndConsumer': function(urlConsumerPerson, urlConsumers){

    var urlConsumersString = '';
    for (url in urlConsumers){
      urlConsumersString += urlConsumers[url] + '\n'
    }

    return HTTP.put(urlConsumerPerson, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlConsumersString
    });
  },

  'joinPersonAndSphere': function(urlSpherePerson, urlSpheres){
    var urlSpheresString = '';
    for ( url in urlSpheres){
      urlSpheresString += urlSpheres[url] + '\n'
    }

    return HTTP.put(urlSpherePerson, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlSpheresString
    });
  },

  'upsertConsumer' : function(consumerObject){
    var url = localhost + slash + consumers;
    var response = HTTP.post(url, {
      data : {
        identifier:   consumerObject.identifier,
        name:         consumerObject.name,
        description:  consumerObject.description,
        isEnabled:    consumerObject.isEnabled,
        isDeleted:    consumerObject.isDeleted
      }
    });
    return response;
  },

  'updateSphereEnabled' : function(enabledObject){
    Spheres.update(
    { 
      _id: enabledObject.documentId
    }, {
      $set: {
        enabled: enabledObject.isEnabled
      }
    });       
  },

  'registerUser' : function(personObject){
    var _id = Meteor.userId();  
    var url = localhost + slash + people + slash;
    var response = HTTP.post(url, {
      data: {
        identifier: _id,
        name : personObject.name,
        surname : personObject.surname,
        email : personObject.email,
        password : personObject.password
      }
    }, function(error, response){
      if( error ){
        console.log('Error: ' + error);
      } else {
        console.log('User added correctly!');
        console.log(response);
      }
    });
  },

  'loginWithPassword' : function(loginObject){ 
    var url = localhost + slash + people + slash + search + slash + findByEmail + loginObject.email;
    try{
      var response = HTTP.get(url);
      var user = JSON.parse(response.content);
      if ( user == undefined || user == null ){
        throw new Meteor.Error('404', 'User not found', 'User not found in the Database');
      }

      return user;
    } catch (error) {
      console.log('Error while authenticating the user... ' + error);
      throw new Meteor.Error('404', 'User not found', 'User not found in the Database');
    }
  },

  'getConsumersbyPerson': function(consumersUrl){
    try{
      var response = HTTP.get(consumersUrl);
      var content = JSON.parse(response.content);
      var consumersList = content._embedded.consumers;
      return consumersList;
    } catch (error){
      console.log(error);
    }
    return [];
  },

  'getConsumers': function(){
    var url = localhost + slash + consumers;
    var consumersList;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      consumersList = content._embedded.consumers;

    } catch (error){
      console.log(error);
    }
    return consumersList;
  },

  'getProvidersbyPerson': function(providersUrl){
    try{
      var response = HTTP.get(providersUrl);
      var content = JSON.parse(response.content);
      var providersList = content._embedded.providers;
      return providersList;
    } catch (error){
      console.log(error);
    }
    return [];
  },

  'getSpheresByPerson': function(spheresUrl){
    try{
      var response = HTTP.get(spheresUrl);
      var content = JSON.parse(response.content);
      var spheresList = content._embedded.spheres;
      return spheresList;
    } catch (error){
      console.log(error);
    }
    return [];
  },

  'getProviders': function(){
    var url = localhost + slash + providers;
    var providersList;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      providersList = content._embedded.providers;

    } catch (error){
      console.log(error);
    }
    return providersList;
  },

  'getSpheres': function(){
    var url = localhost + slash + spheres;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      spheresList = content._embedded.spheres;
      return spheresList;
    } catch (error){
      console.log(error);
    }
    return '';
  },

  'getSphere': function(sphereUrl){
    try{
      var response = HTTP.get(sphereUrl);
      var content = JSON.parse(response.content);
      return content;
    } catch(error) {
      console.log(error);
    }
    return '';
  },

  'getConsumersInSphere': function(sphereConsumersUrl){
    try{
      var response = HTTP.get(sphereConsumersUrl);
      var content = JSON.parse(response.content);
      var consumers = content._embedded.consumers;
      return consumers;
    } catch(error) {
      console.log(error);
    }
    return [];
  },

  'getCategoriesByProviders': function(providerNames){
    var url = localhost + slash + providers + slash + search + slash + findCategoriesByProviderNamesList + providerNames;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      var attributeCategories = content._embedded.attributeCategories;
      return attributeCategories;
    } catch (error) {
      console.log(error);
    }
  },

  'getAttributesByProviders': function(providerNames){
    var url = localhost + slash + providers + slash + search + slash + findAttributesByProviderNamesList + providerNames;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      return attributes;
    } catch (error) {
      console.log(error);
    }
  },

  'getAttributesBySphere': function(sphereAttributesUrl){
    try{
      var response = HTTP.get(sphereAttributesUrl);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      return attributes;
    } catch (error) {
      console.log(error);
    }
  }
});


Meteor.publish('getConsumersPublish', function(){

    var self = this;

    var url = localhost + slash + consumers;
    var consumersList;
    try{
      var response = HTTP.get(url);
      var content = JSON.parse(response.content);
      consumersList = content._embedded.consumers;
      for( c in consumersList){

        var consumer = {
          name: consumersList[c].name,
          description : consumersList[c].description
        };
        self.added('consumers', Random.id(), consumer);
      }
      self.ready();
    } catch (error){
      console.log(error);
    }
});

/*Meteor.publish('getProviders', function(){
  return Providers.find({userId: this.userId}, { sort: {createdAt: 1} });
});

Meteor.publish('getSpheres', function(){
  return Spheres.find({userId: this.userId}, { sort: {createdAt: 1} });
});

Meteor.publish('getSphereById', function(sphereId){
  return Spheres.find({_id: sphereId});
});*/

/*Meteor.publish('getConsumers', function(){
  //return Consumers.find({userId: this.userId}, { sort: {createdAt: 1} });
  //return Consumers.find();

/*  var self = this;
  var userId = this.userId;
  try {
    var url = localhost + slash + people + slash + search + slash + findByIdentifier + userId;
    console.log(url);*/

/*    var options = {
        headers: {'Content-Type': 'application/json'}
      }

    var response = HTTP.call('GET', url, options, function(error, response){
      if (error) {
        console.log(error);
      } else {
        console.log(response)
        var content = response.content;
        var json = JSON.parse(content);
        console.log(typeof json);
        console.log(json.surname);
      }
    });*/

/*    var response = HTTP.get(url);

    var content = JSON.parse(response.content);

    var consumersLink = content._links.consumers.href;
    console.log(consumersLink);*/

/*  } catch (error) {
    console.log(error);
  }*/

/*  var url = localhost + slash + consumers;
  HTTP.call('GET', url, {}, function(error, response){
    if(error){
      console.log(error);
    } else {
      var content = JSON.parse(response.content);
      return content;
    }
  });  
  return {};
});*/

/*Meteor.publish('getAttributesDefinition', function(){
  return AttributesDefinition.find();
});

Meteor.publish('getAttributes', function(){
  return Attributes.find();
});

Meteor.publish('getProviderById', function(providerId){
  return Providers.find({_id: providerId});
});

Meteor.publish('getAttributesFromProvider', function(providerName){
  return Attributes.find({serviceProvider: providerName});
});*/