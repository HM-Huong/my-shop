const mongoose = require('mongoose');
const debug = require('debug')('app:DB');

module.exports.connect = async () => {
	if (!process.env.MONGODB_URI) {
		debug('MONGODB_URI is not defined');
		process.exit(1);
	}
	debug('Connecting to MongoDB');
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		debug('Connected to MongoDB');
	} catch (error) {
		debug('Error while connecting to MongoDB', error);
	}
};