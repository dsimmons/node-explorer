/* Global dependencies and exports */
sys = require('sys');
path = require('path');
express = require('express');
require('joose');
require('joosex-namespace-depended');
require('hash');

app = module.exports = express.createServer();
app_root = __dirname;

/* Connect to MongoDB */
mongoose = require('mongoose');
db = mongoose.connect('mongodb://localhost/node-explorer');

if (db) {
	console.log("Connection to MongoDB successful!");
} else {
	console.log("Unable to connect to MongoDB!");
	throw err;
}

require('./models/user.js');
User = mongoose.model('User');

/* See if we need to create the admin account */
User.findOne({}, function(err, user) {
	if (!user) {
		console.log("It appears this is the first time you've run node-explorer!");
		console.log("Initializing admin account....");
		var user = new User();
		user.username = 'admin';
		user.password = Hash.sha256('password');
		user.isEnabled = true;
		user.isAdmin = true;
		user.save(function(err) {
			if (err) console.log("Unable to write to database!");
			else console.log("Admin account created succesfully! (admin :: password)");
		});
	}
});

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

// Libraries
auth = require('./lib/auth.js');

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("Running out of: %s", app_root);
