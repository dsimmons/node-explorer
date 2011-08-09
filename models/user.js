mongoose.model('User', new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	loginCount: { type: Number, default: 1 },
	locations: Array,
	downloads: Array,
	requests: Array,
	quota: { type: Number, default: 5 }, // 5GB quota
	registrationDate: { type: Date, default: Date.now },
	accessedDate: { type: Date, default: Date.now },
	isEnabled: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	adminMessage: { 
		type: String, 
		default: 'Your account is currently awaiting administrator approval.'
	}
}));
