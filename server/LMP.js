//declare a simple async function
function delayedMessge(delay, message, callback) {
  setTimeout(function() {
    callback(null, message);
  }, delay);
}



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
          enabled:            sphereObject.isEnabled,
          deleted:            sphereObject.isDeleted,
          dataextracted:      sphereObject.isDataExtracted,
        },
        auth: basic_auth
      });
      return response;
      
    } else {
      var response = HTTP.put(sphereObject.url, {
        data: {
          identifier:         sphereObject.identifier,
          name:               sphereObject.name,
          description:        sphereObject.description,
          type:               sphereObject.type,
          enabled:            sphereObject.isEnabled,
          deleted:            sphereObject.isDeleted,
          dataextracted:      sphereObject.isDataExtracted
        },
        auth: basic_auth
      });
      return response;
    }
  },

  'upsertEntity': function(entityObject, userUrl){
    var url = host + slash + entities;

    var response = HTTP.post(url, {
      data : {
        identifier: entityObject.identifier,
        name: entityObject.name,
        description: entityObject.description,
        email: entityObject.email
      },
      auth: basic_auth
    });
    var location = response.headers.location;
    return location;
  },

  'updateEntityRequests': function(userUrl, entityUrls){
    console.log('in updateEntityRequests');

    var entityUrlString = _.map(entityUrls, function(url){
      return url + '\n';
    }).join('').trim();

    var response = HTTP.put(userUrl, {
      headers: {
        "Content-Type":  "text/uri-list"
      },
      content: entityUrlString,
      auth: basic_auth
    });
    return response;
  },

  'updateEntity': function(entityObject, entityUrl){
    var response = HTTP.patch(entityUrl, {
      data: {
        name: entityObject.name,
        description: entityObject.description,
        email: entityObject.email
      },
      auth: basic_auth
    });
  },

  'joinSphereAndConsumer': function(sphereConsumerUrl, consumersUrl){
    var urlConsumersString = '';
    for (url in consumersUrl) {
      urlConsumersString += consumersUrl[url] + '\n'
    }

    return HTTP.put(sphereConsumerUrl, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlConsumersString,
      auth: basic_auth
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
      content: urlAttributesString,
      auth: basic_auth
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
      },
      auth: basic_auth
    });
    return response;
  },

  'joinPersonAndProvider': function(urlProviderPerson, urlProviders){
    var urlProvidersString = '';
    for (url in urlProviders){
      urlProvidersString += urlProviders[url] + '\n'
    }
    console.log(urlProviderPerson)
    console.log(urlProvidersString)
    return HTTP.put(urlProviderPerson, {
      headers: {
        "Content-Type":       " text/uri-list",
        "auth": "web@hotmail.com:EurecatLMP2016!"
      },
      content: urlProvidersString,
      auth: basic_auth
    });
  },

  'deletePersonAndProviderRelation': function(providerId, userId){
    console.log('deletePersonAndProviderRelation');
    var url = host + slash + "delete/provider/" + providerId + "/user/" + userId;

    return HTTP.get(url, http_options);
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
      content: urlConsumersString,
      auth: basic_auth
    });
  },

  'joinPersonAndSphere': function(urlSpherePerson, urlSpheres){
    var urlSpheresString = '';
    console.log('joinPersonAndSphere');
    for ( url in urlSpheres){
      urlSpheresString += urlSpheres[url] + '\n'
    }
    console.log(urlSpheresString);
    return HTTP.put(urlSpherePerson, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlSpheresString,
      auth: basic_auth
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
      },
      auth: basic_auth
    });
    return response;  
  },

  'updateSphereEnabled' : function(enabled, sphereUrl){
    var response = HTTP.patch(sphereUrl, {
      data: {
        enabled: enabled
      },
      http_options
    });
    return response;  
  },

  'updateProviderEnabled' : function(enabled, providerUrl){
    var response = HTTP.patch(providerUrl, {
      data: {
        enabled: enabled
      },
      auth: basic_auth
    });
    return response;  
  },

  'registerUser' : function(personObject){
    var _id = Meteor.userId();  
    var url = host + slash + people + slash;
    var response = HTTP.post(url, {
      data: {
        identifier:   _id,
        name :        personObject.name,
        surname :     personObject.surname,
        phone:        personObject.phone,
        email :       personObject.email,
        password :    personObject.password,
        personal_id:  personObject.personal_id
      },
      auth: basic_auth
    }, function(error, response){
      if( error ){
        console.log('Error in registerUser');
        console.log(error);
      } else {
        console.log('User added correctly!');
        console.log(response);
      }
    });
  },

  'loginWithPassword' : function(loginObject){ 
    var url = host + slash + people + slash + search + slash + findByEmail + loginObject.email;
    try{
      var response = HTTP.get(url, 
        http_options);
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
      var response = HTTP.get(spheresUrl,
        http_options);
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
      var response = HTTP.get(sphereUrl,
        http_options);
      var content = JSON.parse(response.content);
      return content;
    } catch(error) {
      console.log(error);
    }
    return '';
  },

  'updateUser': function(user){
    HTTP.put(user.link, {
      data: {
        name:         user.name,
        surname:      user.surname,
        phone:        user.phone,
        email:        user.email,
        password:     user.password,
        personal_id:  user.personal_id
      },
      auth: basic_auth
    });
  },

  'getConsumersByUser': function(consumersUrl){
    try{
      var response = HTTP.get(consumersUrl,
        http_options);
      var content = JSON.parse(response.content);
      var consumersList = content._embedded.consumers;
      return consumersList;
    } catch (error){
      console.log(error);
    }
    return [];
  },

  'joinPersonAndEntities': function(urlPersonEntities, entitiesUrl){
    var urlEntitiesString = '';
    for ( url in entitiesUrl){
      urlEntitiesString += entitiesUrl[url] + '\n'
    }
    return HTTP.put(urlPersonEntities, {
      headers: {
        "Content-Type":       "text/uri-list"
      },
      content: urlEntitiesString,
      auth: basic_auth
    });
  },

  'getAndDeletePersonOrganizationRelationshipsByEntityEmail': function(entityEmail){
    var url = host + slash + personEntityRelationships + slash + search + slash +  
      findPersonEntityRelationshipsByEntityEmail + questionMark +
      'email=' + entityEmail;

    var response = HTTP.get(url,
      http_options);
    var content = JSON.parse(response.content);
    var associations = content._embedded.personEntityRelationships;

    _.each(associations, function(association){
      var associationLink = association._links.self.href;
      HTTP.call('DELETE', associationLink, http_options);
    });
    return content;
  },

  'deleteEntity': function(entityUrl){
    var response = HTTP.call('DELETE', entityUrl, http_options);
  },

  'getEntity': function(entityUrl){
    var response = HTTP.get(entityUrl, http_options);
    var entity = JSON.parse(response.content);
    if ( entity == undefined || entity == null ){
        throw new Meteor.Error('404', 'Entity not found', 'Entity not found in the Database');
    }
    return entity;
  },

  'getPersonOrganizationRelationshipByEntityEmailAndPersonEmail': function(userEmail, entityEmail){
    var url = host + slash + personEntityRelationships + slash + search + slash +  
      findPersonEntityRelationshipByEntityEmailAndPersonEmail + questionMark +
      'entityEmail=' + entityEmail + ampersand + 'personEmail=' + userEmail; 
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var associationLink = content._links.self.href;
    return associationLink;
  },

  'changePersonOrganizationState': function(associationLink, state){
    HTTP.patch(associationLink, {
      data: {
        state: state
      },
      auth: basic_auth
    });
  },

  'deletePersonOrganizationRelationship': function(associationLink){
    console.log('deleting personOrganizationRelationship...');
    var response = HTTP.call('delete', associationLink, http_options); 
  },

  'insertPersonOrganizationRelationship': function(userUrl, entityUrl, state){
    console.log('insertPersonOrganizationRelationship');

    var personEntityRelationshipsUrl = host + slash + personEntityRelationships

    var response = HTTP.post(personEntityRelationshipsUrl, {
      data: {
        state: state,
        organization: entityUrl,
        person: userUrl
      },
      auth: basic_auth
    });
    return response;
  },

  'findTokenByproviderNameAndUserEmail': function(providerName, email){
    console.log('in findTokenByproviderNameAndUserEmail');

    var url = host + slash + providerTokens + slash + search + slash + findByproviderNameAndUserEmail
      + questionMark + providerNameParameter + providerName + ampersand + emailParameter + email;

    try {
      var response = HTTP.get(url, http_options);
      var content = JSON.parse(response.content);
      var token = content.token;
      return token;
    } catch(error) {
      return null;
    }
  },

  'createNewToken': function(providerName, email){
    var url = host + slash + createNewToken + questionMark + providerParameter + providerName 
      + ampersand + emailParameter + email;

    try {
      return url;
    } catch(error) {
      console.log(error);
      return null;
    }
  }
});

Meteor.publish('getConsumers', function(){
  var self = this;
  var url = host + slash + consumers;
  try{
    var response = HTTP.get(url, http_options);
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
    var response = HTTP.get(url, http_options);
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
  console.log('getProviders');
  var self = this;
  var url = host + slash + providers;
  try{
    var response = HTTP.get(url, http_options);
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
        link:         providersList[p]._links.provider.href,
        oAuth:        providersList[p].oAuth,
        oAuthUrl:     providersList[p].oAuthUrl
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
  console.log('getProvidersByUser');
  var self = this;
  if(providersUrl != null) {
    try{
      var response = HTTP.get(providersUrl, http_options);
      var content = JSON.parse(response.content);
      var providersList = content._embedded.providers;

      for ( p in providersList){
        var provider = {
          id:               providersList[p].id,
          name:             providersList[p].name,
          description:      providersList[p].description,
          type:             providersList[p].type,
          url:              providersList[p].url,
          enabled:          providersList[p].enabled,
          deleted:          providersList[p].deleted,
          link:             providersList[p]._links.provider.href,
          attributesLink:   providersList[p]._links.attributeMaps.href
        }
        self.added('providersByUser', Random.id(), provider); 
      }
    } catch (error){
      console.log('Error in getProvidersByUser');
      console.log(error);
    }
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getConsumersInSphere', function(sphereConsumersUrl){
  var self = this;
  if(sphereConsumersUrl != null){
    try{
      var response = HTTP.get(sphereConsumersUrl, http_options);
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
  console.log('getCategoriesByProviders');
  var self = this;
  var url = host + slash + providers + slash + search + slash + findCategoriesByProviderNamesList + providerNames;
  try{
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var attributeCategories = content._embedded.attributeCategories;
    for (a in attributeCategories){
      var attribute = {
        name: attributeCategories[a].name
      }
      self.added('categoriesByProviders', Random.id(), attribute);
    }
  } catch (error) {
    console.log('Error in getCategoriesByProviders');
    console.log(error);
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getAttributes', function(){
  console.log('getAttributes');
  var self = this;
  var url = host + slash + attrs;
  try{
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var attributes = content._embedded.attributes;
    for (a in attributes){
      var attribute = {
        name:           attributes[a].name,
        category:       attributes[a].subcategory.category.name,
        subcategory:    attributes[a].subcategory.name,
        //providerLink:   attributes[a]._links.provider.href
      }
      self.added('attributes', Random.id(), attribute);
    }
  } catch (error) {
    console.log('Error in getAttributes');
    console.log(error);
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getAttributesBySphere', function(sphereAttributesUrl){
  console.log('getAttributesBySphere');
  var self = this;
  if (sphereAttributesUrl != null){
    try{
      var response = HTTP.get(sphereAttributesUrl, http_options);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      for (a in attributes){
        console.log(attributes[a])
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
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getSpheresByUser', function(spheresUrl){
  var self = this;
  console.log('getSpheresByUser');
  console.log(spheresUrl);
  try{
    var response = HTTP.get(spheresUrl, http_options);
    var content = JSON.parse(response.content);
    var spheresList = content._embedded.spheres;
    for (s in spheresList){
      var sphere = {
        name:           spheresList[s].name,
        description:    spheresList[s].description,
        type:           spheresList[s].type,
        link:           spheresList[s]._links.self.href,
        enabled:        spheresList[s].enabled,
        dataextracted:  spheresList[s].dataextracted
      }
      self.added('spheresByUser', Random.id(), sphere);
    }
  } catch (error){
    console.log('Error in getSpheresByUser')
    console.log(error);
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getAttributesByProviders', function(providerNames){
  var self = this;
  console.log('getAttributesByProviders');
  if (providerNames.length > 0){
    try{
      var url = host + slash + attrs + slash + search + slash + findAttributesByProviderNamesList + providerNames.toString();
      var response = HTTP.get(url, http_options);
      var content = JSON.parse(response.content);
      var attributes = content._embedded.attributes;
      for (a in attributes){
        var attribute = {
          name:           attributes[a].name,
          category:       attributes[a].categoryName,
          subcategory:    attributes[a].subcategoryName,
          enabled:        attributes[a].enabled,
          link:           attributes[a]._links.self.href
        }
        self.added('attributesByProviders', Random.id(), attribute);
      }


    } catch (error){
      console.log('error in getAttributesByProviders');
      console.log(error);   
    }
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getConsumersByUser', function(consumersUrl){
  console.log('getConsumersByUser');
  console.log(consumersUrl);
  var self = this;
  if (consumersUrl != null){
    try{
      var response = HTTP.get(consumersUrl , http_options);
      var content = JSON.parse(response.content);
      var consumers = content._embedded.consumers;

      _.each(consumers, function(consumer){
        var consumerObject = {
          name:         consumer.name,
          link:         consumer._links.self.href,
          description : consumer.description
        }
        self.added('consumersByUser', Random.id(), consumerObject);
      });

    } catch (error){
      console.log('Error in getConsumersByUser');
      console.log(error);
    }
  }
  console.log('---------------------------------------------------');
  self.ready();
});

Meteor.publish('getRegisteredEmailsandRegisteredIds', function(){
  console.log('getRegisteredEmailsandRegisteredIds');
  var self = this;
  try {
    var url = host + slash + people;
    var response = HTTP.get(url , http_options);
    var content = JSON.parse(response.content);
    var users = content._embedded.people;

    _.each(users, function(user){
      var email = { email: user.email};
      self.added('registeredEmails', Random.id(), email);
      var personal_id = {personal_id: user.personal_id};
      self.added('registeredIds', Random.id(), personal_id);
    });
  } catch (error){
    console.log('Error in getRegisteredEmailsandRegisteredIds');
    console.log(error);
  }
  self.ready();

});

Meteor.publish('getEntities', function(){
  console.log('getEntities');
  var self = this;
  try{
    var url = host + slash + entities;
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
      var entityObject = {
        name: entity.name,
        description: entity.description,
        email: entity.email,
        link: entity._links.self.href,
        identifier: entity.identifier
      }
      self.added('entities', Random.id(), entityObject);
    });

  } catch (error) {
    console.log('Error in getEntities');
    console.log(error);
  }
  self.ready();
});


// FOR USERS SCREENS
Meteor.publish('getEntitiesRequestedFromEntities', function(userEmail){
  console.log('getEntitiesRequestedFromEntities');
  var self = this;
  var url = host + slash + entities + slash + search + slash +  
          findEntitiesByPersonEmailAndState + questionMark + 'email=' + userEmail + ampersand + 'state=' + REQUESTED_FROM_ENTITY; 
  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
        var entityObject = {
          name: entity.name,
          description: entity.description,
          email: entity.email,
          link: entity._links.self.href
        }
        self.added('entitiesRequestedFromEntities', Random.id(), entityObject);
    });
  } catch (error) {
    console.log('Error in getEntitiesRequestedFromEntities');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getEntitiesRequestedFromUsers', function(userEmail){
  console.log('getEntitiesRequestedFromUsers');
  var url = host + slash + entities + slash + search + slash +  
          findEntitiesByPersonEmailAndState + questionMark + 'email=' + userEmail + ampersand + 'state=' + REQUESTED_FROM_USER; 

  var self = this;
  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
        var entityObject = {
          name: entity.name,
          description: entity.description,
          email: entity.email,
          link: entity._links.self.href
        }
        self.added('entitiesRequestedFromUsers', Random.id(), entityObject);
    });
  } catch (error) {
    console.log('Error in getEntitiesRequestedFromUsers');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getAdminEntities', function(userEmail){
  console.log('getAdminEntities');
  var self = this;

  var url = host + slash + entities + slash + search + slash +  
    findEntitiesByPersonEmailAndState + questionMark + 'email=' + userEmail + ampersand + 'state=' + ADMINISTRATOR; 

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
        var entityObject = {
          name: entity.name,
          description: entity.description,
          email: entity.email,
          link: entity._links.self.href
        }
        self.added('adminEntities', Random.id(), entityObject);
    });
  } catch (error) {
    console.log('Error in getAdminEntities');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getEntitiesAssociated', function(userEmail){
  console.log('getEntitiesAssociated');
  var self = this;

  var url = host + slash + entities + slash + search + slash +  
    findEntitiesByPersonEmailAndState + questionMark + 'email=' + userEmail + ampersand + 'state=' + ASSOCIATED; 

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
        var entityObject = {
          name: entity.name,
          description: entity.description,
          email: entity.email,
          link: entity._links.self.href
        }
        self.added('entitiesAssociated', Random.id(), entityObject);
    });
  } catch (error) {
    console.log('Error in getEntitiesAssociated');
    console.log(error);
  }
  self.ready();
});




// Published called from entities screens
Meteor.publish('getUsersRequestedFromEntities', function(entityEmail){
  console.log('getUsersRequestedFromEntities');
  var self = this;

 var url = host + slash + people + slash + search + slash +  
    findPeopleByEntityEmailAndState + questionMark + 'email=' + entityEmail + ampersand + 'state=' + REQUESTED_FROM_ENTITY; 

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
        var personObject = {
          name: person.name,
          surname: person.surname,
          email: person.email,
          link: person._links.self.href
        }
        self.added('usersRequestedFromEntities', Random.id(), personObject);
    });
  } catch (error) {
    console.log('Error in getUsersRequestedFromEntities');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getUsersRequestedFromUsers', function(entityEmail){
  console.log('getUsersRequestedFromUsers');
  var self = this;

 var url = host + slash + people + slash + search + slash +  
    findPeopleByEntityEmailAndState + questionMark + 'email=' + entityEmail + ampersand + 'state=' + REQUESTED_FROM_USER; 

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
        var personObject = {
          name: person.name,
          surname: person.surname,
          email: person.email,
          link: person._links.self.href
        }
        self.added('usersRequestedFromUsers', Random.id(), personObject);
    });
  } catch (error) {
    console.log('Error in getUsersRequestedFromUsers');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getAdminUsers', function(entityEmail){
  console.log('getAdminUsers');
  var self = this;

  var url = host + slash + people + slash + search + slash +  
    findPeopleByEntityEmailAndState + questionMark + 'email=' + entityEmail + ampersand + 'state=' + ADMINISTRATOR; 

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
        var personObject = {
          name: person.name,
          surname: person.surname,
          email: person.email,
          link: person._links.self.href
        }
        self.added('adminUsers', Random.id(), personObject);
    });
  } catch (error) {
    console.log('Error in getAdminUsers');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getUsersAssociated', function(entityEmail){
  console.log('getUsersAssociated');
  var self = this;

  var url = host + slash + people + slash + search + slash +  
    findPeopleByEntityEmailAndState + questionMark + 'email=' + entityEmail + ampersand + 'state=' + ASSOCIATED;

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
        var personObject = {
          name: person.name,
          description: person.description,
          email: person.email,
          link: person._links.self.href
        }
        self.added('usersAssociated', Random.id(), personObject);
    });
  } catch (error) {
    console.log('Error in getUsersAssociated');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getEntitiesWithRelationship', function(userEmail){
  console.log('getEntitiesWithRelationship');
  var self = this;

  var url = host + slash + entities + slash + search + slash +  
    findEntitiesByPersonEmail + questionMark + 'email=' + userEmail;
  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var entitiesAPI = content._embedded.entities;

    _.each(entitiesAPI, function(entity){
        var entityObject = {
          name: entity.name,
          description: entity.description,
          email: entity.email,
          link: entity._links.self.href
        }
        self.added('entitiesWithRelationship', Random.id(), entityObject);
    });
  } catch (error) {
    console.log('Error in getEntitiesWithRelationship');
    console.log(error);
  }
  self.ready();
});


Meteor.publish('getPeople', function(){
  console.log('getPeople');
  var self = this;
  try{
    var url = host + slash + people;
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
      var personObject = {
        name: person.name,
        email: person.email,
        link: person._links.self.href
      }
      self.added('people', Random.id(), personObject);
    });

  } catch (error) {
    console.log('Error in getPeople');
    console.log(error);
  }
  self.ready();
});

Meteor.publish('getPeopleWithRelationship', function(entityEmail){
  console.log('getPeopleWithRelationship');
  var self = this;

  var url = host + slash + people + slash + search + slash +  
    findPeopleByEntityEmail + questionMark + 'email=' + entityEmail;

  try {
    var response = HTTP.get(url, http_options);
    var content = JSON.parse(response.content);
    var peopleAPI = content._embedded.people;

    _.each(peopleAPI, function(person){
        var personObject = {
          name: person.name,
          description: person.description,
          email: person.email,
          link: person._links.self.href
        }
        self.added('peopleWithRelationship', Random.id(), personObject);
    });
  } catch (error) {
    console.log('Error in getPeopleWithRelationship');
    console.log(error);
  }
  self.ready();
});