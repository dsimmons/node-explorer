/* Global dependencies and exports */
sys = require('sys');
path = require('path');
fs = require('fs');
express = require('express');
stylus = require('stylus');
//jade = require('jade');
//TODO: replace this crap with crypto
require('joose');
require('joosex-namespace-depended');
require('hash');
require('colors');

/* Defaults to HTTP server */
/* Optionally, HTTPS with certificates in ./conf */
/* You can use ./scripts/generate-certificate.sh to generate self-signed certs */
if (path.existsSync('./conf/key.pem')) {
	if (path.existsSync('./conf/cert.pem')) {
		app = express.createServer({
			key: fs.readFileSync('./conf/key.pem'),
			cert: fs.readFileSync('./conf/cert.pem')
		});
		app.isHTTPS = true;
	}
} else {
	app = express.createServer();
	app.isHTTPS = false;
}
app.app_root = __dirname;


/* Connect to MongoDB */
mongoose = require('mongoose');
db = mongoose.connect('mongodb://localhost/node-explorer');

console.log('');
if (db) {
	console.log("Connection to MongoDB successful!".green);
} else {
	console.log("Unable to connect to MongoDB!".red);
	throw err;
}

require('./models/user.js');
User = mongoose.model('User');

/* See if we need to create the admin account */
User.findOne({}, function(err, user) {
	if (!user) {
		console.log("It appears this is the first time you've run node-explorer!".white);
		console.log("Initializing admin account....".white);
		var user = new User();
		user.firstName = 'Administrator';
		user.lastName = 'N/A';
		user.username = 'admin';
		user.password = Hash.sha256('password');
		user.email = 'admin@localhost.com';
		user.quota = Number.MAX_VALUE;
		user.isEnabled = true;
		user.isAdmin = true;
		user.save(function(err) {
			if (err) console.log("Unable to write to database!".red);
			else console.log("Admin account created succesfully! (admin :: password)".green);
		});
	}
});

/* Configuration */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'I bet you wont guess my secret...' }));
  app.use(stylus.middleware({
	  src: __dirname + '/public',
	  compile: function compile(str, path) {
			return stylus(str).set('filename', path).set('compress', true);
		}
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Libraries
auth = require('./lib/auth.js');
validate = require('./lib/validate.js');

// Router
require('./controllers/routes.js');

app.listen(3000);

console.log(
		'Express server listening on port '.blue + '%d'.green.bold +' over '.blue + '%s', 
		app.address().port, 
		(app.isHTTPS) ? 'HTTPS '.green.bold + '(REMEMBER: https://...)'.red.bold : 'HTTP'.green);
console.log('Running in %s mode out of: '.blue + '%s'.white, app.settings.env, app.app_root);

// MAGIC!  Don't touch.  Spent a lot of time making this look pretty (>.<)
console.log('                   _                                 _                         '.white);
console.log('                  | |                               | |                        '.white);
console.log('  _____   ___  ___| |  ___________  _____  _______  | |  ___  ____  ____  ____ '.white);
console.log(' | _   \\/ _  \\/  _  |/ _  |______|/ _ |\\ \\/ / |  _ \\| | / _ \\|  __|/ _  \\|  __|'.white);
console.log(' | | | || (_) | (_| |  __/       |  _/ >    < | |_) | || (_) | |  |  __/ | |   '.white);
console.log(' |_| |_|\\___ / \\____|\\___|        \\___//_/\\_\\ |  __/|_| \\___/|_|   \\___| |_|   '.white);
console.log('                                              | |                               '.white);
console.log('                                              |_|                               '.white);
