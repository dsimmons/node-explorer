(function() {

	exports.createUser = function(firstName, lastName, username, password, email, fn) {
		User.findOne({'username':username}, function(err, user) {
			if (err) {
				return fn(new Error('[createUser] Retreiving ' + username + ' failed'));
			}

			// If the user makes it here, they should be authenticated.
			// TODO: verify
			//if (user) {
				//return fn(new Error('[createUser] User ' + username + ' already exists!'));

			//} else {

				var user = (user) ? user : new User();
				console.log('before: ');
				console.log(user);
				user.firstName = firstName;
				user.lastName = lastName;
				user.username = username;
				user.password = Hash.sha256(password);
				user.email = email;
				user.save(function(err) {
					if (err) {
						return fn(new Error('[createUser] Saving user ' + username + ' failed.'));
					}
					else {
						console.log('after');
						console.log(user);
						return fn(null, user);
					}
				});
			//}
		});
	}

	exports.login = function(username, password, fn) {
		User.findOne({'username':username}, function(err, user) {
				if (err) {
					return fn(new Error('[login] Retrieving ' + username + ' failed'));
				}

				if (user) {
					if (user.password === Hash.sha256(password)) {
						return fn(null, user);
					} else {
						return fn(new Error('[login] Incorrect password for ' +username));
					}
				} else {
					return fn(new Error('[login] User ' + username + ' not found!'));
				}
		});
	}

 })();
