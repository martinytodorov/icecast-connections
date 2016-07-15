//Use express for routing
var express = require('express');
var app = express();
var routes = require('./routes')

//Setup basic auth
var basicAuth = require('basic-auth-connect');
app.use(basicAuth(config.basicauth_user, config.basicauth_pass));

//Setup the views dir
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

//Setup the public dir
app.use(express.static(__dirname + './../public'));

//The index should load all the collections
app.get('/', routes.index);

//The index should load all the collections
app.get('/stream/*', routes.stream);

//Start the http server
app.listen(3003, function () {
  console.log('Server listening on port 3003!');
});
