app.get('/signup', function(req, res) {
	res.render('signup');
});

app.post('/signup', function(req, res) {
	auth.createUser(req.body.username, req.body.password, req.body.email, function() {

		if ((err) || (!user)) {
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			res.redirect('/login');
		}

	});

});
