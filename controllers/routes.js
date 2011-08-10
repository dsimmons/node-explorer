//var remoteAddr = (app.isHTTPS) ? req.connection.socket.remoteAddress : req.connection.remoteAddress;
app.get('/', checkSession, checkEnabled, function(req, res) {
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

app.get('/disabled', checkSession, function(req, res) {
	res.render('user/disabled', { locals: { user: req.session.user } });
});

app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/login');
	});
});

app.param('username', checkSession, checkEnabled, function(req, res, next, username) {
	if ((req.session.user.username === username) || req.session.user.isAdmin) {
		next();
	} else {
		return next(new Error('Access to specified user denied. '
				+ req.session.user.username + ' does not have permission.'));
	}
});

app.get('/user/:username', function(req, res) {
	retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user)){
			console.log(err);
			res.redirect('back');
		}
		else
			res.render('user/edit', { locals: { user: user } });
	});
});

app.get('/downloads/:username', function(req, res) {
	retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user))
			res.redirect('back');
		else
			res.render('user/downloads', { locals: { user: user } });
	});
});

app.get('/requests/:username', function(req, res) {
	retrieveUser(req.params.username, function(err, user) {
		if ((err) || (!user))
			res.redirect('back');
		else
			res.render('user/requests', { locals: { user: user } });
	});
});

app.post('/login', function(req, res) {

	auth.login(req.body.username, req.body.password, function(err, user) {

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

//TODO
app.post('/user', function(req, res) {
	var user = new User();
	auth.saveUser(user, function(err) {
		if (user)
			res.redirect('/login');
		else
			res.redireect('back');
	});
});

//TODO
app.post('/user/:username', function(req, res) {

});

function retrieveUser(username, fn) {
	User.findOne({ 'username': username }, function(err, user) {
		if (err || (!user))
			return fn(new Error('Unable to retrieve user!'));
		else
			return fn(null, user);
	});
}

function checkEnabled(req, res, next) {
	if (!req.session.user.isEnabled)
		res.redirect('/disabled');
	else
		next();
}

function checkSession(req, res, next) {
	if (req.session.user) 
		next();
	else 
		res.redirect('/login'); 
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
