app.get('/user', function(req, res) {
	console.log(req.session.user);
	res.render('user', { 'user': req.session.user });
});

app.post('/user', function(req, res) {
	auth.createUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password, req.body.email, function(err, user) {

		if ((err) || (!user)) {
			req.session.error = 'Unable to create new user.';
			res.redirect('back');

		} else if (user) {
			res.redirect('/login');
		}

	});

});
