//var remoteAddr = (app.isHTTPS) ? req.connection.socket.remoteAddress : req.connection.remoteAddress;
// Finished
app.get('/', checkSession, function(req, res) {
	res.render('index', { locals: { user: req.session.user } });
});

// Finished
app.get('/register', function(req, res) {
	if (req.user.session)
		res.redirect('/');
	else
		res.render('register');
});

// Finished
app.get('/login', function(req, res) {
	if (req.user.session)
		res.redirect('/');
	else
		res.render('login');
});

// Finished
app.get('/admin', checkSession, checkAdmin, function(req, res) {
	res.render('admin', { locals: { user: req.session.user } });
});

// Finished
app.get('/disabled', checkSession, function(req, res) {
	res.render('disabled', { locals: { message: req.session.user.adminMessage } });
});

// Finished
app.get('/logout', function(req, res) {
	res.session.destroy(function() {
		res.redirect('/login');
	});
});

// Finished
app.param('username', function(req, res, next, username) {
	
	if ((req.session.user.username === req.params.username) || 
			req.session.user.isAdmin) {
		next();
	} else {
		return next(new Error('Access to specified user denied. '
				+ req.session.user.username + ' does not have permission.'));
	}
});

app.get('/user/:username', checkSession, function(req, res) {

});

app.get('/downloads/:username', checkSession, function(req, res) {

});

app.get('/requests/:username', checkSession, function(req, res) {

});

// Finished
function checkSession(req, res, next) {
	if (req.session.user) 
		next();
	else 
		res.redirect('/login'); 
}

// Finished
function checkAdmin(req, res, next) {
	if (req.session.user.isAdmin) 
		next(); 
	else 
		res.redirect('/');
}
