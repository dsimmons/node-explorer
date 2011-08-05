var schema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	email: String,
	registerDate: { type: Date, default: Date.now },
	accessDate: { type: Date, default: Date.now },
	isEnabled: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false }
});

mongoose.model('User', schema); 
