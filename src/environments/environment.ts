// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: '/giom/',
  useHash: true,
  //localUrls :'180.183.66.201:8080/int-servicios/apiGiom',
  ldapUrl : 'http://180.183.174.37:7011/ldapWS',
  peopleUrl: 'http://180.183.112.90:7012/PeopleSoftWS/rest/PeopleSoft',
  app : 'GIOM',
  ApiServicios : 'http://180.183.171.164:7004/gamWS2/apiGiom',
  //intServiciosUrl = MSI
  intServiciosUrl :'http://180.183.174.37:7010/int-servicios',
  diremURl : 'http://180.183.174.37:7007/diremWS',
  sic : 'http://180.183.171.164:7004/sic'
};


/* PRODUCCION
export const environment = {
  production: false,
  baseUrl: '/giom/',
  useHash: true,
  //localUrls :'180.183.66.201:8080/int-servicios/apiGiom',
  ldapUrl : 'http://sun1313.banvenez.corp:7011/ldapWS',
  peopleUrl: 'http://sun1305.banvenez.corp:7012/PeopleSoftWS/rest/PeopleSoft',
  app : 'GIOM',
  ApiServicios : 'http://plgiom01.banvenez.corp:7003/gamWS2/apiGiom',
  intServiciosUrl :'http://180.183.202.124:7012/int-servicios',
  diremURl : 'http://180.183.174.37:7007/diremWS',
  sic : 'http://172.27.66.165:7003/sic'
};
*/

/* CALIDAD
export const environment = {
  production: false,
  baseUrl: '/giom/',
  useHash: true,
  //localUrls :'180.183.66.201:8080/int-servicios/apiGiom',
  ldapUrl : 'http://180.183.174.37:7011/ldapWS',
  peopleUrl: 'http://180.183.112.90:7012/PeopleSoftWS/rest/PeopleSoft',
  app : 'GIOM',
  ApiServicios : 'http://localhost:8080/int-servicios/apiGiom',
  intServiciosUrl :'http://180.183.174.37:7010/int-servicios',
  diremURl : 'http://180.183.174.37:7007/diremWS',
  sic : 'http://180.183.171.164:7004/sic'
};
*/



/**
* export const environment = {
production: false,
baseUrl: '/scbdv/',
useHash: true,
ldapUrl : 'http://180.183.174.37:7011/ldapWS',
peopleUrl: 'http://180.183.112.90:7012/PeopleSoftWS/rest/PeopleSoft',
app : 'SCBDV',
ApiServicios : 'http://sun23dl04n1.banvendes.corp:7007/scbdv-comedor/api',
intServiciosUrl :'http://180.183.174.37:7010/int-servicios',
diremURl : 'http://180.183.174.37:7007/diremWS'
};
*/

/* intServiciosUrl :'http://180.183.66.201:8080/int-servicios',
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
