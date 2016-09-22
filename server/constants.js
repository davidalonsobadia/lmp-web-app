/*
* CONSTANTS
*/

/*host = 'http://localhost:8080';*/
host = 'http://172.20.49.20:9763/LmpApi'
slash = '/';
people = 'people';
person = 'person';
consumers = 'consumers';
spheres = 'spheres';
providers = 'providers';
entities = 'entities';
providerTokens = 'providerTokens';

emailParameter = "email=";
providerNameParameter = 'providerName=';
providerParameter = 'provider=';
userParameter = 'user=';
passwordParameter = 'password=';

attrs = 'attributes';
search = 'search';

findByIdentifier = 'findByIdentifier?identifier=';
findByEmail = 'findFirstByEmail?email=';
findCategoriesByProviderNamesList = 'findCategoriesByProviderNamesList?providerNames='
findAttributesByProviderNamesList = 'findAttributesByProviderNamesList?names='
findAttributesByProviderName = 'findAttributesByProviderName?name='
findByproviderNameAndUserEmail = 'findByproviderNameAndUserEmail'


findEntitiesByPersonEmailAndState = 'findEntitiesByPersonEmailAndState'
findPeopleByEntityEmailAndState = 'findPeopleByEntityEmailAndState'
findPersonEntityRelationshipByEntityEmailAndPersonEmail = 'findPersonEntityRelationshipByEntityEmailAndPersonEmail'
findPersonEntityRelationshipsByEntityEmail = 'findPersonEntityRelationshipsByEntityEmail'
findEntitiesByPersonEmail = 'findEntitiesByPersonEmail'
findPeopleByEntityEmail = 'findPeopleByEntityEmail'

personEntityRelationships = 'personEntityRelationships'

loginWithPassword = 'loginWithPassword'

createNewToken = 'createNewToken'

questionMark = '?'

ampersand = '&'

basic_auth = 'web@hotmail.com:EurecatLMP2016!'

REQUESTED_FROM_ENTITY = 'REQUESTED_FROM_ENTITY';
REQUESTED_FROM_USER = 'REQUESTED_FROM_USER';
ASSOCIATED = 'ASSOCIATED';
ADMINISTRATOR = 'ADMINISTRATOR';


// Environment variables
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

http_options = { auth: basic_auth };