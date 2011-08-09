(function() {

 	// If the user is registering for the first time, create a new user 
	// If the user already exists, update 
	exports.saveUser = function(firstName, lastName, username, passOld, password, email, fn) {
		User.findOne({'username':username}, function(err, user) {
			if (err) {
				return fn(new Error('[saveUser] Retreiving ' + username + ' failed'));
			}
			//var origin = (req.header('Referer').indexOf('/signup') >= 0) ? 'signup' : 'user';
			var userExists = (user) ? true : false;
			var user = (userExists) ? user : new User();

			// If updating a user, verify that the previous patchword is correct.
			if (userExists) {
				console.log(typeof(passOld));
				// If passOld isn't defined, we're at the signup page.
				if (typeof(passOld) === undefined) {
					return fn(new Error('[saveuser] Trying to create user that already exists'));

				// We're at the 'Edit Profile' page
				} else if ((passOld.length === 0) || (user.password !== Hash.sha256(passOld))) {
					return fn(new Error('[saveUser] Incorrect old password for ' + username));
				}
			}

			user.firstName = firstName;
			user.lastName = lastName;
			user.username = username;
			user.password = Hash.sha256(password);
			user.email = email;

			user.save(function(err) {
				if (err) {
					return fn(new Error('[saveUser] Saving user ' + username + ' failed.'));
				}
				else {
					return fn(null, user);
				}
			});
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
