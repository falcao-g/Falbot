const mongoose = require('mongoose');
require('dotenv').config();

class databaseHandler {
	async connect() {
		try {
			mongoose.set('strictQuery', false);
			mongoose.connect(process.env.MONGODB_URI, {
				keepAlive: true,
			});
		} catch {
			console.log('A conexão caiu');
			mongoose.connect(process.env.MONGODB_URI);
		}

		mongoose.connection.on('error', (err) => {
			console.log(`Erro na conexão: ${err}`);
			mongoose.connect(process.env.MONGODB_URI);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('A conexão caiu');
			mongoose.connect(process.env.MONGODB_URI);
		});

		mongoose.connection.on('disconnecting', () => {
			console.log('A conexão caiu');
			mongoose.connect(process.env.MONGODB_URI);
		});

		mongoose.connection.on('MongoNetworkError', () => {
			console.log('A conexão caiu');
			mongoose.connect(process.env.MONGODB_URI);
		});

		mongoose.connection.on('MongooseServerSelectionError', () => {
			console.log('A conexão caiu');
			mongoose.connect(process.env.MONGODB_URI);
		});
	}
}

module.exports = new databaseHandler();
