(function() {

 	// If the user is registering for the first time, create a new user 
	// If the user already exists, update 
	exports.saveUser = function(req, user, fn) {
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.username = req.body.username;
		user.password = crypto.createHmac('sha256', req.body.password).digest('hex');
		user.email = req.body.email;
		user.save(function(err) {
			if (err)
				return fn(new Error('[saveUser] Saving user ' + username + ' failed.'));
			else
				return fn(null, user);
		});
	}

	exports.login = function(req, username, password, fn) {

		this.retrieveUser(username, function(err, user) {
			if (err || (!user))
				return fn(new Error('[login] Retrieving ' + username + ' failed'));
			else {
				if (user.password === crypto.createHmac('sha256', password).digest('hex')) {
					var remoteAddr = (app.isHTTPS) 
						? req.connection.socket.remoteAddress : req.connection.remoteAddress;
					var newAddr = true;
					user.loginCount++;
					user.accessedDate = Date.now();
					for (var i = 0; i < user.locations.length; i++) {
						if (user.locations[i] === remoteAddr) {
							newAddr = false;
							break;
						}
					}	
					if (newAddr) user.locations.unshift(remoteAddr);

					user.save(function(err) {
						if (err) {
							console.log(err);
							return fn(new Error('[login] Couldnt update user before return!'));
						} else
							return fn(null, user);
					});
				} else
					return fn(new Error('[login] Incorrect password for ' +username));
			} 
		});
	}

	exports.retrieveUser = function(username, fn) {

		User.findOne({ 'username': username }, function(err, user) {
			if (err || (!user))
				return fn(new Error('Unable to retrieve user!'));
			else
				return fn(null, user);
		});
	}

})();
