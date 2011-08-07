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

		// These field lengths (boundaries) are semi-arbitrariy atm.
		var validationList = {
			'firstName': function() {
				return regex_normal.test(form.firstName);
			}(),
			'lastName': function() {
				return regex_normal.test(form.lastName);
			}(),
			'username': function() {
				return regex_normal.test(form.username);
			}(),
			'password': function() {
				return regex_password.test(form.password);
			}(),
			'passMatch': function() {
				return (form.password === form.password2);
			}(),
			'email': function() {
				return regex_email.test(form.email);
			}(),
		}
		if (origin === 'user') {
			validationList['passOld'] = function() {
				return regex_password.test(form.newPass);
			}()
		}

		var valid = true;
		for (var i in validationList) {
			if (!validationList[i]) {
				valid = false;
				break;
			}
		}
		console.log(validationList);
		console.log('Valid input: ' + valid);
		if (valid)
			next();
		else {
			// TODO: add later
		}
	}

 })();
