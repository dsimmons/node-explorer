var schema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	username: { type: String },
	password: { type: String },
	email: { type: String },
	registered: { type: Date, default: Date.now },
	lastAccess: { type: Date, default: Date.now }
});

mongoose.model('User', schema); 
