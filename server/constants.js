/*
* CONSTANTS
*/

host = 'http://localhost:8080';
/*host = 'https://bd-vm-d-wso2as:9443/LmpApi'*/
slash = '/';
people = 'people';
person = 'person';
consumers = 'consumers';
spheres = 'spheres';
providers = 'providers';
entities = 'entities';

entitiesToVerify = 'entitiesToVerify';
adminEntities = 'adminEntities';
verifiedEntities = 'verifiedEntities';

verifiedUsers = 'verifiedUsers';
usersToVerify = 'usersToVerify';
adminUsers = 'adminUsers';

attrs = 'attributes';
search = 'search';

findByIdentifier = 'findByIdentifier?identifier=';
findByEmail = 'findFirstByEmail?email=';
findCategoriesByProviderNamesList = 'findCategoriesByProviderNamesList?providerNames='
findAttributesByProviderNamesList = 'findAttributesByProviderNamesList?providerNames='

findOrganizationsByPersonMailAndState = 'findOrganizationsByPersonMailAndState'
findPeopleByEntityMailAndState = 'findPeopleByEntityMailAndState'
findPersonOrganizationRelationshipByEntityEmailAndPersonEmail = 'findPersonOrganizationRelationshipByEntityEmailAndPersonEmail'
findPersonOrganizationRelationshipsByEntityEmail = 'findPersonOrganizationRelationshipsByEntityEmail'
findOrganizationsByPersonEmail = 'findOrganizationsByPersonEmail'
findPeopleByEntityEmail = 'findPeopleByEntityEmail'

personOrganizationRelationships = 'personOrganizationRelationships'

questionMark = '?'

ampersand = '&'

REQUESTED_FROM_ENTITY = 'REQUESTED_FROM_ENTITY';
REQUESTED_FROM_USER = 'REQUESTED_FROM_USER';
ASSOCIATED = 'ASSOCIATED';
ADMINISTRATOR = 'ADMINISTRATOR';


// Environment variables
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';