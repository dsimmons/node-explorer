app.get('/', checkSession, function(req, res) {
	res.render('index', {
		locals: { 
					name: req.session.user.name, 
					hashPass: JSON.stringify(req.session.user.hashPass)
				}
	});
});

function checkSession(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/login');
	}
};
