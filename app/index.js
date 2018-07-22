/*
 * primary file for the API
 *
 */

 // Dependencies
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var stringDecoder = require('string_decoder').StringDecoder;
 var config = require('./lib/config');
 var fs = require('fs');
 var handlers = require('./lib/handlers');
 var helpers = require('./lib/helpers');

// @TODO get rid of this
helpers.sendTwilioSms('6039696723',"Hello",function(err){
  console.log('this was the error',err);
});


 // Instantiate http server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

 // start the serve - listen on port specified in config.js
httpServer.listen(config.httpPort,function(){
  console.log("The server is lisening on port " + config.httpPort);
});

var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

// Instantiate https server
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
 unifiedServer(req,res);
});


// start the serve - listen on port specified in config.js
httpsServer.listen(config.httpsPort,function(){
 console.log("The server is lisening on port " + config.httpsPort);
});


// create unified server
var unifiedServer = function(req,res){
  // Get URL and parse setInterval
  var parsedUrl = url.parse(req.url,true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get query string as object
  var queryStringObject = parsedUrl.query;

  // Get HTTP method
  var method = req.method.toLowerCase();

  // get HEeaders as object
  var headers = req.headers;

  // Get payload, if any
  var decoder = new stringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    // choose handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct data ojject
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

   // Route request to chosen handler
   chosenHandler(data,function(statusCode,payload){
     // use statusCode  or default to 200
     // use payload or default to empty object
     statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
     payload = typeof(payload) == 'object' ? payload : {};
     // convert payload to string
     var payloadString = JSON.stringify(payload);
     // Send Response
     res.setHeader('Content-Type','application/json')
     res.writeHead(statusCode);
     res.end(payloadString);
     // Log response
     console.log('Returning this response: ',statusCode,payloadString);
   });

  });
};


// define request router
var router = {
  'ping' : handlers.ping,
  'users' : handlers.users,
  'tokens' : handlers.tokens,
  'checks' : handlers.checks
};
