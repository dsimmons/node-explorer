app.get('/signup', function(req, res) {
	res.render('signup');
});

app.post('/signup', function(req, res) {
	auth.createUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password, 
		req.body.email, function(err, user) {

		if ((err) || (!user)) {
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			res.redirect('/login');
		}

	});

});
