app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {
	auth.login(req.body.username, req.body.password, function(err, user) {

		if ((err) || (!user)) {
			req.session.error = 'Authentication failed. Check username and password.';
			res.redirect('back');
		} else if (user) {
			req.session.regenerate(function() {
				req.session.cookie.maxAge = 1000 * 60 * 60; //check -- 1 min?
				req.session.user = user;

				res.redirect('/');
			});
		}
	});

});
