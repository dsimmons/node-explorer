/****************
/** GET routes **
*****************/

// Login -> (!admin), main page
app.get('/', checkSession, function(req, res) {
	res.render('index', { 'user': req.session.user });
});


// Login -> (admin), admininstrator panel
app.get('/admin', checkAdmin, function(req, res) {
	res.render('admin', { 'user': req.session.user });

});


app.get('/login', function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		res.render('login', {'user': null});
	}
});


app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});


app.get('/signup', function(req, res) {
	res.render('signup', {'user': null});
});


// Edit Profile
app.get('/user', checkSession, function(req, res) {
	res.render('user', { 'user': req.session.user });
});


/************************
/** Session validation **
*************************/
function checkSession(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
}


function checkAdmin(req, res, next) {
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


/****************
/** POST routes **
*****************/
app.post('/login', function(req, res) {

	auth.login(req.body.username, req.body.password, function(err, user) {

		if ((err) || (!user)) {
			req.session.error = 'Authentication failed. Check username and password.';
			res.redirect('back');
		} else if (user) {
			req.session.regenerate(function() {
				req.session.cookie.maxAge = 1000 * 60 * 60; //check -- 1 min?
				req.session.user = user;

				if (user.isAdmin === true) 
					res.redirect('/admin')
				else
					res.redirect('/');
			});
		}
	});
});

function validateForm(req, res, next) {
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
		'passMatch': function() {
			return (form.password === form.password2);
		}(),
		'password': function() {
			return regex_password.test(form.password);
		}(),
		'email': function() {
			return regex_email.test(form.email);
		}(),
	}
	if (origin === 'user') {
		validationList['newPass'] = function() {
			return (form.newPass != undefined) && (regex_password.test(form.newPass));
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
	console.log('valid: ' + valid);
	console.log(origin);
	if (valid)
		next();

}


// 2 possibilities (any user db addition/modification):
// 		1) Register -> new user is inserted
// 		2) Edit Profile -> user fields are updated
// 		Either way, validate user input first.
app.post('/user', validateForm, function(req, res) {
	var form = req.body;

	auth.createUser(form.firstName, form.lastName, form.username, 
		form.password, form.email, function(err, user) {

		if ((err) || (!user)) {
			console.log(err);
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			res.redirect('/login');
		}

	});
});
