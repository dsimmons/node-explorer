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
};


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
};


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


// 2 possibilities (any user db addition/modification):
// 		1) Register -> new user is inserted
// 		2) Edit Profile -> user fields are updated
app.post('/user', function(req, res) {

	auth.createUser(req.body.firstName, req.body.lastName, req.body.username, 
		req.body.password, req.body.email, function(err, user) {

		if ((err) || (!user)) {
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			res.redirect('/login');
		}

	});
});
