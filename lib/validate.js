(function() {


	exports.checkSession = function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			req.session.error = 'Access denied!';
			res.redirect('/login');
		}
	}

	exports.checkAdmin = function(req, res, next) {
		if (req.session.user) {
			if (req.session.user.isAdmin === true) {
				next();
			} else {
				req.session.error = "Valid user but is not an admin! Access denied";
				res.redirect('/');
			}
		} else {
			req.session.error = 'User not authenticated, please log in.';
			res.redirect('/login');
		}
	}

	// Just checks for valid input fields and that passwords match.
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
			errorMessages.push('	Valid special characters: !@#$%^&*-+,._');
		}
		if (!(form.password === form.password2))
			errorMessages.push('Passwords were not the same, please try again.');
		if (!regex_email.test(form.email))
			errorMessages.push('Not a valid email address.');
		// These field lengths (boundaries) are semi-arbitrariy atm.
		//var validationList = {
			//'firstName': function() {
				//return regex_normal.test(form.firstName);
			//}(),
			//'lastName': function() {
				//return regex_normal.test(form.lastName);
			//}(),
			//'username': function() {
				//return regex_normal.test(form.username);
			//}(),
			//'password': function() {
				//return regex_password.test(form.password);
			//}(),
			//'passMatch': function() {
				//return (form.password === form.password2);
			//}(),
			//'email': function() {
				//return regex_email.test(form.email);
			//}(),
		//}
		if (origin === 'user') {
			//validationList['passOld'] = function() {
				//return regex_password.test(form.newPass);
			//}()
			if (!regex_password.test(form.passOld))
				errorMessages.push('Existing password incorrect. Try again.');
		}

		var valid = (errorMessages.length > 0) ? false : true;
		//for (var i in validationList) {
			//if (!validationList[i]) {
				//valid = false;
				//break;
			//}
		//}
		//console.log(errorMessages);
		//console.log('Valid input: ' + valid);
		if (valid) {
			next();
		}
		else {
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
