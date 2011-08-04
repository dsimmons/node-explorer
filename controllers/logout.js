app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});
