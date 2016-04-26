Meteor.methods({
  
  'upsertSphere' : function(sphereObject, httpCommand){
    if(httpCommand == 'POST'){
      var url = host + slash + spheres;
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
    var url = host + slash + providers;
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
    console.log('joinPersonAndConsumer');
    console.log(urlConsumersString);
    console.log('---------------------------------------------------');
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
    var url = host + slash + consumers;
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
    var url = host + slash + people + slash;
    var response = HTTP.post(url, {
      data: {
        identifier: _id,
        name : personObject.name,
        surname : personObject.surname,
        //phone:    personObject.phone,
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
    var url = host + slash + people + slash + search + slash + findByEmail + loginObject.email;
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
  'getSphere': function(sphereUrl){
    try{
      var response = HTTP.get(sphereUrl);
      var content = JSON.parse(response.content);
      return content;
    } catch(error) {
      console.log(error);
    }
    return '';
  }

/*  'getConsumersInSphere': function(sphereConsumersUrl){
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
    var url = host + slash + providers + slash + search + slash + findCategoriesByProviderNamesList + providerNames;
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
    var url = host + slash + providers + slash + search + slash + findAttributesByProviderNamesList + providerNames;
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
  },

  'getAttributesByProvider': function(providerAttributesUrl){
    try{
      var response = HTTP.get(providerAttributesUrl);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      return attributes;
    } catch (error) {
      console.log(error);
    }
  }
*/
/*  'getConsumersbyPerson': function(consumersUrl){
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
    var url = host + slash + consumers;
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
*/
/*  'getProviders': function(){
    var url = host + slash + providers;
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
*/
});

Meteor.publish('getConsumers', function(){
  var self = this;
  var url = host + slash + consumers;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    var consumersList = content._embedded.consumers;
    for( c in consumersList){
      var consumer = {
        name: consumersList[c].name,
        description : consumersList[c].description,
        link: consumersList[c]._links.consumer.href
      }
      self.added('consumers', Random.id(), consumer);
    }
    self.ready();
  } catch (error){
    console.log('Error in getConsumers');
    console.log(error);
  }
});

Meteor.publish('getSpheres', function(){
  var self = this;
  var url = host + slash + spheres;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    spheresList = content._embedded.spheres;
    for (s in spheresList){
      var sphere = {
        name:           spheresList[c].name,
        description:    spheresList[c].description,
        type:           spheresList[c].type
      }
      self.added('spheres', Random.id(), sphere);
    }
    self.ready();
  } catch (error){
    console.log('Error in getSpheres');
    console.log(error);
  }
});

Meteor.publish('getProviders', function(){
  var self = this;
  var url = host + slash + providers;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    var providersList = content._embedded.providers;

    for (p in providersList){

      var provider = {
        name:         providersList[p].name,
        description:  providersList[p].description,
        type:         providersList[p].type,
        url:          providersList[p].url,
        enabled:      providersList[p].enabled,
        deleted:      providersList[p].deleted,
        link:         providersList[p]._links.provider.href
      }
      self.added('providers', Random.id(), provider);
    }
    self.ready();
  } catch (error){
    console.log('Error in getProviders');
    console.log(error);
  }
});

Meteor.publish('getProvidersByUser', function(providersUrl){
  var self = this;
  if(providersUrl != null) {
    try{
      var response = HTTP.get(providersUrl);
      var content = JSON.parse(response.content);
      var providersList = content._embedded.providers;

      for ( p in providersList){
        var provider = {
          name:             providersList[p].name,
          description:      providersList[p].description,
          type:             providersList[p].type,
          url:              providersList[p].url,
          enabled:          providersList[p].enabled,
          deleted:          providersList[p].deleted,
          link:             providersList[p]._links.provider.href,
          attributesLink:   providersList[p]._links.attributes.href
        }
        self.added('providersByUser', Random.id(), provider); 
      }
    } catch (error){
      console.log('Error in getProvidersByUser');
      console.log(error);
    }
  }
  self.ready();
});

Meteor.publish('getConsumersInSphere', function(sphereConsumersUrl){
  var self = this;
  if(sphereConsumersUrl != null){
    try{
      var response = HTTP.get(sphereConsumersUrl);
      var content = JSON.parse(response.content);
      var consumers = content._embedded.consumers;
      for (c in consumers){
        var consumer = {
          name:     consumers[c].name,
          link:     consumers[c]._links.self.href
        }
        self.added('consumersInSphere', Random.id(), consumer);
      }
    } catch(error) {
      console.log('Error in getConsumersInSphere');
      console.log(error);
    }
  }
  self.ready();
});

Meteor.publish('getCategoriesByProviders', function(providerNames){
  var self = this;
  var url = host + slash + providers + slash + search + slash + findCategoriesByProviderNamesList + providerNames;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    var attributeCategories = content._embedded.attributeCategories;
    for (a in attributeCategories){
      var attribute = {
        name: attributeCategories[a].name
      }
      self.added('categoriesByProviders', Random.id(), attribute);
    }
    self.ready();
  } catch (error) {
    console.log('Error in getCategoriesByProviders');
    console.log(error);
  }
});

Meteor.publish('getAttributes', function(){
  var self = this;
  var url = host + slash + attrs;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    var attributes = content._embedded.attributes;
    for (a in attributes){
      var attribute = {
        name:           attributes[a].name,
        category:       attributes[a].subcategory.category.name,
        subcategory:    attributes[a].subcategory.name,
        providerLink:   attributes[a]._links.provider.href
      }
      self.added('attributes', Random.id(), attribute);
    }
  } catch (error) {
    console.log('Error in getAttributes');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getAttributesBySphere', function(sphereAttributesUrl){

  var self = this;
  if (sphereAttributesUrl != null){
    try{
      var response = HTTP.get(sphereAttributesUrl);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      for (a in attributes){
        var attribute = {
          name: attributes[a].name,
          attributesLink: attributes[a]._links.self.href
        }
        self.added('attributesBySphere', Random.id(), attribute);
      }
    } catch (error) {
      console.log('Error in getAttributesBySphere');
      console.log(error);
    }
  }
  self.ready();

});

Meteor.publish('getSpheresByUser', function(spheresUrl){
  var self = this;
  console.log('getSpheresByUser');
  console.log(spheresUrl);
  console.log('---------------------------------------------------');

  try{
    var response = HTTP.get(spheresUrl);
    var content = JSON.parse(response.content);
    var spheresList = content._embedded.spheres;
    for (s in spheresList){
      var sphere = {
        name:           spheresList[s].name,
        description:    spheresList[s].description,
        type:           spheresList[s].type,
        link:           spheresList[s]._links.self.href
      }
      self.added('spheresByUser', Random.id(), sphere);
    }
  } catch (error){
    console.log('Error in getSpheresByUser')
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getAttributesByProviders', function(providerLinks){
  var self = this;
  console.log('getAttributesByProviders');
  console.log(providerLinks);
  console.log('---------------------------------------------------');

  if (providerLinks.length > 0){
    try{
      for (p in providerLinks){
        var response = HTTP.get(providerLinks[p]);
        var content = JSON.parse(response.content);
        var attributes = content._embedded.attributes;
        for (a in attributes){
          var attribute = {
            name:           attributes[a].name,
            category:       attributes[a].subcategory.category.name,
            subcategory:    attributes[a].subcategory.name,
            providerLink:   attributes[a]._links.provider.href,
            enabled:        attributes[a].enabled,
            link:           attributes[a]._links.self.href
          }
          self.added('attributesByProviders', Random.id(), attribute);
        }
      }
    } catch (error){
      console.log('error in getAttributesByProviders');
      console.log(error);   
    }
  }
  self.ready();
});

Meteor.publish('getConsumersByUser', function(consumersUrl){

  var self = this;
  console.log('getConsumersByUser');
  console.log(consumersUrl);
  console.log('---------------------------------------------------');
  if (consumersUrl != null){
    try{
      var response = HTTP.get(consumersUrl);
      var content = JSON.parse(response.content);
      var consumers = content._embedded.consumers;
      for (c in consumers){
        var consumer = {
          name:         consumers[c].name,
          link:         consumers[c]._links.self.href,
          description : consumers[c].description
        }
        self.added('consumersByUser', Random.id(), consumer);
      }
    } catch (error){
      console.log('Error in getConsumersByUser');
      console.log(error);
    }
  }
  self.ready();
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
    var url = host + slash + people + slash + search + slash + findByIdentifier + userId;
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

/*  var url = host + slash + consumers;
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

/*Meteor.publish('getAttributesByProviders', function(providerNames){
  var self = this;
  var url = host + slash + providers + slash + search + slash + findAttributesByProviderNamesList + providerNames;
  try{
    var response = HTTP.get(url);
    var content = JSON.parse(response.content);
    var attributes = content._embedded.attributes;
    for (a in attributes){
      var attribute = {
        name: attributes[a].name
      }
      self.added('attributesByProviders', Random.id(), attribute);
    }
    self.ready();
  } catch (error) {
    console.log(error);
  }
});*/