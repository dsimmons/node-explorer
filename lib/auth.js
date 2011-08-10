(function() {

 	// If the user is registering for the first time, create a new user 
	// If the user already exists, update 
	// TODO
	exports.saveUser = function(user, fn) {

			 //If updating a user, verify that the previous patchword is correct.
			//if (userExists) {
				//console.log(typeof(passOld));
				 //If passOld isn't defined, we're at the signup page.
				//if (typeof(passOld) === undefined) {
					//return fn(new Error('[saveuser] Trying to create user that already exists'));

				 //We're at the 'Edit Profile' page
				//} else if ((passOld.length === 0) || (user.password !== Hash.sha256(passOld))) {
					//return fn(new Error('[saveUser] Incorrect old password for ' + username));
				//}
			//}
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.username = req.body.username;
		user.password = crypto.createHmac('sha256', password).digest('hex');
		user.email = req.body.email;

		user.save(function(err) {
			if (err)
				return fn(new Error('[saveUser] Saving user ' + username + ' failed.'));
			else
				return fn(null, user);
		});
	}

	exports.login = function(username, password, fn) {

		User.findOne({'username':username}, function(err, user) {
			if (err || (!user))
				return fn(new Error('[login] Retrieving ' + username + ' failed'));
			else {
				if (user.password === crypto.createHmac('sha256', password).digest('hex'))
					return fn(null, user);
				else
					return fn(new Error('[login] Incorrect password for ' +username));
			} 
		});
	}

 })();
