app.get('/', checkSession, function(req, res) {
	res.render('index', { 'user': req.session.user });
});


function checkSession(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};


app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});
