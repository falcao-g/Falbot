const mongoose = require('mongoose');
const interestSchema = require('../schemas/interest.js');
const lotterySchema = require('../schemas/lotto.js');

class databaseHandler {
	player = require('../database/player.js');

	constructor() {
		this.connect().then(async () => {
			await interestSchema.findByIdAndUpdate('interest', { _id: 'interest' }, { upsert: true });
			await lotterySchema.findByIdAndUpdate('weekly', { _id: 'weekly' }, { upsert: true });
		});
	}

	async connect() {
		try {
			mongoose.set('strictQuery', false);
			mongoose.connect(process.env.MONGODB_URI);
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
