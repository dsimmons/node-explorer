(function() {
	
	//TODO: redo
	exports.checkForm = function(req, res, next) {
		var form = req.body;
		var origin = (req.header('Referer').indexOf('/signup') >= 0) ? 'signup' : 'user';
		var regex_normal = /\b\w{1,15}\b/; 
		var regex_password = /[a-zA-Z0-9!@$%^&*-+,._]{6,35}/;
		var regex_email = /\b[\w.-]+@{1}\w+\.[a-zA-Z]{2,4}\b/;
		var errorMessages = [];

		if (!regex_normal.test(form.firstName))
			errorMessages.push('First Name is invalid in length.');
		if (!regex_normal.test(form.lastName))
			errorMessages.push('Last Name is invalid in length.');
		if (!regex_normal.test(form.username))
			errorMessages.push('Username is invalid in length.');
		if (!regex_password.test(form.password)) {
			errorMessages.push('Password must be at least 6 characters long');
			errorMessages.push('\tValid special characters: !@#$%^&*-+,._');
		}
		if (!(form.password === form.password2))
			errorMessages.push('Passwords were not the same, please try again.');
		if (!regex_email.test(form.email))
			errorMessages.push('Not a valid email address.');
		if (origin === 'user') {
			// While this doesn't refer back to the DB, we know its incorrect if invalid.
			if ((!form.passOld) || !regex_password.test(form.passOld))
				errorMessages.push('Existing password incorrect. Try again.');
		}

		if (errorMessages.length > 0) {
			next();
		} else {
			if (origin === 'user') {
				if (req.session.user) {
					req.session.user.errors = errorMessages;
					res.render('user', { 'user': req.session.user });
				} else {
					// This is the case when the first signup POST to /user fails.
					// We're at /user, but there is no session. Need to use 'render'
					// to pass locals to the page, so redirect is out of the question.
					var user = {};
					user.errors = errorMessages;
					res.render('signup', { 'user': user });
				}
			} else {
				// Came from /signup (first try). POST validation to /user failed.
				// Now we're at /user. Refer to 'else' clause above.
				var user = {};
				user.errors = errorMessages;
				res.render('signup', { 'user': user });
			}
		}
	}

 })();
