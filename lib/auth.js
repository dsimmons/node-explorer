(function() {

	exports.createUser = function(firstName, lastName, username, password, email, fn) {
		User.findOne({'username':username}, function(err, user) {
			if (err) {
				return fn(new Error('[createUser] Retreiving ' + username + ' failed'));
			}

			if (user) {
				return fn(new Error('[createUser] User ' + username + ' already exists!'));

			} else {
				var user = new User();
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
						return fn(null, user);
					}
				});
			}
		});
	}

	exports.login = function(username, password, fn) {
		User.findOne({'username': username}, function(err, user) {
				if (user) {
					if (user.password === Hash.sha256(password)) {
						return fn(null, user);
					} else {
						return fn(new Error('[login] Incorrect password for ' +username));
					}
					console.log(user.password);
					console.log(Hash.sha256(password));
				} else {
					return fn(new Error('[login] User ' + username + ' not found!'));
				}
		});
		return fn(null, null);
	}

 })();
