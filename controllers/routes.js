app.get('/', checkSession, function(req, res) {
	res.render('index', { locals: { user: req.session.user } });
});

app.get('/register', function(req, res) {
	if (req.session.user)
		res.redirect('/');
	else
		res.render('register', { locals: { user: new User() } });
});

app.get('/login', function(req, res) {
	if (req.session.user) {
		res.redirect('/');
	} else 
		res.render('login');
});

app.get('/admin', checkSession, checkAdmin, function(req, res) {
	res.render('admin', { locals: { user: req.session.user } });
});

app.get('/disabled', function(req, res) {
	res.render('user/disabled', { locals: { user: req.session.user } });
});

app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/login');
	});
});

app.param('username', checkSession, function(req, res, next, username) {
	if ((req.session.user.username === username) || req.session.user.isAdmin) {
		next();
	} else {
		return next(new Error('Access to specified user denied. '
				+ req.session.user.username + ' does not have permission.'));
	}
});

app.get('/user/:username', function(req, res) {
	auth.retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user)){
			console.log(err);
			res.redirect('back');
		}
		else
			res.render('user/edit', { locals: { user: user } });
	});
});

app.get('/downloads/:username', function(req, res) {
	auth.retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user))
			res.redirect('back');
		else
			res.render('user/downloads', { locals: { user: user } });
	});
});

app.get('/requests/:username', function(req, res) {
	auth.retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user))
			res.redirect('back');
		else
			res.render('user/requests', { locals: { user: user } });
	});
});

app.post('/login', function(req, res) {

	auth.login(req, req.body.username, req.body.password, function(err, user) {

		if ((err) || (!user)) {
			console.log(err);
			res.redirect('back');
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

app.post('/register', function(req, res) {

	var newUser = new User();

	auth.retrieveUser(req.body.username, function(err, existingUser) {
		if (existingUser)
			res.redirect('back');
		else {
			auth.saveUser(req, newUser, function(err, user) {
				if (user)
					res.redirect('/login');
				else {
					console.log(err);
					res.redireect('back');
				}
			});
		}
	});
});

//TODO
app.post('/user/:username', function(req, res) {
	var user = auth.retrieveUser(req.params.username, function(err, user) {
		//nest callbacks?
	});
	auth.saveUser(req, user, function(err, user) {
		if (user)
			res.redirect('/login');
		else
			res.redireect('back');
	});

});

function checkSession(req, res, next) {
	if (req.session.user) {
		if (req.session.user.isEnabled)
			next();
		else
			res.redirect('/disabled');
	}
	else  {
		res.redirect('/login'); 
	}
}

function checkAdmin(req, res, next) {
	if (req.session.user.isAdmin) 
		next(); 
	else 
		res.redirect('/');
}

// Make sure we keep serving static file requests
app.get('/*.(js|css)', function(req, res) {
	res.sendfile('./'+req.url);
});

// NEEDS to remain last. Handles all requests that aren't valid.
//app.get('/*', function(req, res) {
	//if (req.session.user)
		//res.redirect('back');
	//else
		//res.redirect('/login');
//});
