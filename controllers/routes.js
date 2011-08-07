/****************
/** GET routes **
*****************/

// Login -> (!admin), main page
app.get('/', validate.checkSession, function(req, res) {
	res.render('index', { 'user': req.session.user });
});


// Login -> (admin), admininstrator panel
app.get('/admin', validate.checkAdmin, function(req, res) {
	res.render('admin', { 'user': req.session.user });

});

// Default with no session, log in screen
app.get('/login', function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else {
		var user = {};
		user.errors = [];
		res.render('login', { 'user': user }); 
	}
});


app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});


// New User
app.get('/signup', function(req, res) {
	var user = {};
	user.errors = [];
	res.render('signup', { 'user': user });
});


// Edit Profile
app.get('/user', validate.checkSession, function(req, res) {
	req.session.user.registered = true;
	req.session.user.errors = [];
	res.render('user', { 'user': req.session.user });
});


/****************
/** POST routes **
*****************/
app.post('/login', function(req, res) {

	auth.login(req.body.username, req.body.password, function(err, user) {

		if ((err) || (!user)) {
			console.log(err);
			req.session.error = 'Authentication failed. Check username and password.';

			var user = {};
			user.errors = ['Incorrect username or password!'];
			res.render('login', { 'user': user });
		} else if (user) {
			req.session.regenerate(function() {
				req.session.cookie.maxAge = 1000 * 60 * 60; // 1 hour
				req.session.user = user;

				if (user.isAdmin) 
					res.redirect('/admin')
				else
					res.redirect('/');
			});
		}
	});
});


// 2 possibilities (any user db addition/modification):
// 		1) Register -> new user is inserted
// 		2) Edit Profile -> user fields are updated
// 		Either way, validate user input first.
app.post('/user', validate.checkForm, function(req, res) {
	var form = req.body;

	auth.saveUser(form.firstName, form.lastName, form.username, form.passOld,
		form.password, form.email, function(err, user) {

		if ((err) || (!user)) {
			console.log(err);
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			// If the user has a session (already logged in), update the 
			// session fields to reflect changes.
			if (req.session.user) {
				req.session.user = user;
			}
			res.redirect('/login');
		}

	});
});
