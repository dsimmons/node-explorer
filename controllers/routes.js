app.get('/', function(req, res) {
	var remoteAddr = (app.isHTTPS) ? req.connection.socket.remoteAddress : req.connection.remoteAddress;
	console.log(remoteAddr);
	console.log(app.isHTTPS);
	console.log(app.app_root);
	res.send(remoteAddr);
});
