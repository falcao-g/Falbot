const mongoose = require('mongoose');

const reqString = {
	type: String,
	required: true,
};

const stats = mongoose.Schema({
	_id: false,
	commands: { type: Number, default: 0 },
	itemsFound: { type: Number, default: 0 },
	timesWorked: { type: Number, default: 0 },
	timesExplored: { type: Number, default: 0 },
	timesFished: { type: Number, default: 0 },
	timesHunted: { type: Number, default: 0 },
	timesMined: { type: Number, default: 0 },
	timesVoted: { type: Number, default: 0 },
	itemsCrafted: { type: Number, default: 0 },
	lotteryWins: { type: Number, default: 0 },
	scratchJackpots: { type: Number, default: 0 },
	timesWatered: { type: Number, default: 0 },
	cropsHarvested: { type: Number, default: 0 },
	listingsSold: { type: Number, default: 0 },
	mythicalUsed: { type: Number, default: 0 },
});

const userSchema = mongoose.Schema(
	{
		_id: reqString,
		falcoins: {
			type: Number,
			default: 10000,
		},
		wins: {
			type: Number,
			default: 0,
		},
		bank: {
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
			type: stats,
			default: {},
		},
		plots: [
			{
				_id: false,
				crop: {
					type: String,
					default: '',
					required: true,
				},
				harvestTime: {
					type: Number,
					default: 0,
					required: true,
				},
				lastWatered: {
					type: Number,
					default: 0,
					required: true,
				},
			},
		],
		premium: {
			_id: false,
			active: {
				type: Boolean,
				default: false,
			},
			expires: {
				type: Number,
				default: 0,
			},
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

module.exports = mongoose.model('users', userSchema);
