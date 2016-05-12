// Mongo Collections
Spheres = new Mongo.Collection('spheres');
Providers = new Mongo.Collection('providers');
Consumers = new Mongo.Collection('consumers');
ConsumersByUser = new Mongo.Collection('consumersByUser');
ProvidersByUser = new Mongo.Collection('providersByUser');
Attributes = new Mongo.Collection('attributes');
AttributesDefinition = new Mongo.Collection('attributesDefinition');

ConsumersInSphere = new Mongo.Collection('consumersInSphere');
CategoriesByProviders = new Mongo.Collection('categoriesByProviders');
AttributesByProviders = new Mongo.Collection('attributesByProviders');
AttributesBySphere = new Mongo.Collection('attributesBySphere');
SpheresByUser = new Mongo.Collection('spheresByUser');

RegisteredEmails = new Mongo.Collection('registeredEmails');
Entities = new Mongo.Collection('entities');


EntitiesRequestedFromEntities = new Mongo.Collection('entitiesRequestedFromEntities');
EntitiesRequestedFromUsers = new Mongo.Collection('entitiesRequestedFromUsers');
AdminEntities = new Mongo.Collection('adminEntities');
EntitiesAssociated = new Mongo.Collection('entitiesAssociated');

EntitiesWithRelationship = new Mongo.Collection('entitiesWithRelationship');
PeopleWithRelationship = new Mongo.Collection('peopleWithRelationship');

UsersRequestedFromEntities = new Mongo.Collection('usersRequestedFromEntities');
UsersRequestedFromUsers = new Mongo.Collection('usersRequestedFromUsers');
AdminUsers = new Mongo.Collection('adminUsers');
UsersAssociated = new Mongo.Collection('usersAssociated');

People = new Mongo.Collection('people');
