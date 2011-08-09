var schema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	email: String,
	loginCount: { type: Number, default: 1 },
	locations: { type: Array, default: [] },
	downloads: { type: Array, default: [] },
	requests: { type: Array, default: [] },
	quota: { type: Number, default: 5 }, // 5GB quota
	registrationDate: { type: Date, default: Date.now },
	accessedDate: { type: Date, default: Date.now },
	isEnabled: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false }
});

mongoose.model('User', schema); 
