app.get('/admin', checkAdmin, function(req, res) {
	res.render('admin', { 'user': req.session.user });

});

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
