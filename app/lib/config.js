/*
 * Create and export configuration variables
 */

 //container for all environments
 var environments = {};

 // create stagin object

 environments.staging = {
   'httpPort' : 3000,
   'httpsPort' : 3001,
   'envName' : 'staging',
   'hashingSecret' : 'thisIsASecret',
   'maxChecks' : 5,
   'twilio' : {
    'accountSid' : 'AC3d792baee3e427e74196ba607839af60',
    'authToken' : '9e6653f6371ad814eaa1c06ede2b8f8b',
    'fromPhone' : '+16035076097'
  }
 };

// creat production environment
 environments.production = {
   'httpPort' : 5000,
   'httpsPort' : 5001,
   'envName' : 'production',
   'hashingSecret' : 'thisIsAlsoASecret',
   'maxChecks' : 10,
   'twilio' : {
     'accountSid' : 'AC3d792baee3e427e74196ba607839af60',
     'authToken' : '9e6653f6371ad814eaa1c06ede2b8f8b',
     'fromPhone' : '+16035076097'
  }
 };

 // Determine which environment to export
 var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

 // check that env is valid - if not use staging
 var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

 // export the module
 module.exports = environmentToExport;
