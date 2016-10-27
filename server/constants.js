/*
* CONSTANTS
*/

/**
* Backend Servers
*/
// Localhost
//host = 'http://localhost:8080';
// Developer Server
//host = 'http://172.20.49.20:9763/LmpApi'
//Production Server (Backend located in Eurecat)
host = 'http://84.88.76.5:9763/LmpApi'

/**
* Frontend Servers
*/
// Localhost
//recoverUrl = 'http://localhost:3000/changePassword'
// Arsys web server - change Password ()
recoverUrl = 'http://82.223.80.51:3000/changePassword'
// Localhost
//redirectUrl = 'http://localhost:3000/authorization'
// Arsys web server - change Password ()
redirectUrl = 'http://82.223.80.51:3000/authorization'


slash = '/';
people = 'people';
person = 'person';
consumers = 'consumers';
spheres = 'spheres';
providers = 'providers';
entities = 'entities';
tokens = 'tokens';
resetPassword = 'resetPassword';
savePassword = 'savePassword';
newToken = 'newToken';
authorizationUrl = 'authorizationUrl';


emailParameter = "email=";
providerNameParameter = 'providerName=';
providerParameter = 'provider=';
userParameter = 'user=';
passwordParameter = 'password=';
recoverUrlParameter = 'recoverUrl=';
redirectUrlParameter = 'redirectUrl=';
codeParameter = 'code='

attrs = 'attributes';
search = 'search';

findByIdentifier = 'findByIdentifier?identifier=';
findByEmail = 'findFirstByEmail?email=';
findCategoriesByProviderNamesList = 'findCategoriesByProviderNamesList?providerNames='
findAttributesByProviderNamesList = 'findAttributesByProviderNamesList?names='
findAttributesByProviderName = 'findAttributesByProviderName?name='
findTokensByProviderNameAndUserEmail = 'findTokensByProviderNameAndUserEmail'


findEntitiesByPersonEmailAndState = 'findEntitiesByPersonEmailAndState'
findPeopleByEntityEmailAndState = 'findPeopleByEntityEmailAndState'
findPersonEntityRelationshipByEntityEmailAndPersonEmail = 'findPersonEntityRelationshipByEntityEmailAndPersonEmail'
findPersonEntityRelationshipsByEntityEmail = 'findPersonEntityRelationshipsByEntityEmail'
findEntitiesByPersonEmail = 'findEntitiesByPersonEmail'
findPeopleByEntityEmail = 'findPeopleByEntityEmail'

personEntityRelationships = 'personEntityRelationships'

loginWithPassword = 'loginWithPassword'

questionMark = '?'

ampersand = '&'

basic_auth = 'web@hotmail.com:EurecatLMP2016!'

REQUESTED_FROM_ENTITY = 'REQUESTED_FROM_ENTITY';
REQUESTED_FROM_USER = 'REQUESTED_FROM_USER';
ASSOCIATED = 'ASSOCIATED';
ADMINISTRATOR = 'ADMINISTRATOR';


// Environment variables
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.DISABLE_WEBSOCKETS = 1;


http_options = { auth: basic_auth };