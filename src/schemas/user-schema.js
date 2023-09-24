const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const userSchema = mongoose.Schema(
	{
		_id: reqString,
		falcoins: {
			type: Number,
			default: 10000,
		},
		vitorias: {
			type: Number,
			default: 0,
		},
		banco: {
			type: Number,
			default: 0,
		},
		lastVote: {
			type: Number,
			default: 0,
		},
		rank: {
			type: Number,
			default: 1,
		},
		voteReminder: {
			type: Boolean,
			default: false,
		},
		lastReminder: {
			type: Number,
			default: 0,
		},
		tickets: {
			type: Number,
			default: 0,
		},
		voteStreak: {
			type: Number,
			default: 0,
		},
		inventory: {
			type: Map,
			of: Number,
			default: new Map(),
		},
		equippedItems: {
			type: Array,
			default: [],
		},
		cooldowns: {
			type: Map,
			of: Number,
			default: new Map(),
		},
		locale: {
			type: String,
			default: 'en-US',
		},
		inventorySort: {
			type: String,
			default: 'itemValue',
		},
		inventoryBonus: {
			type: Number,
			default: 0,
		},
		stats: {
			type: Map,
			of: Number,
			default: new Map([
				['ranks', 0],
				['commands', 0],
				['itemsFound', 0],
				['timesWorked', 0],
				['timesExplored', 0],
				['timesFished', 0],
				['timesHunted', 0],
				['timesMined', 0],
				['timesVoted', 0],
				['itemsCrafted', 0],
			]),
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model('users', userSchema);
