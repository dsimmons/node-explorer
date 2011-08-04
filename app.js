
// Module dependencies
sys = require('sys');
path = require('path');
express = require('express');
mongoose = require('mongoose');

app_root = __dirname;
global.app = module.exports = express.createServer();

// Set up DB Connection


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'explore-node' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./controllers/index.js');
require('./controllers/login.js');
require('./controllers/signup.js');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("Running out of: %s", app_root);
