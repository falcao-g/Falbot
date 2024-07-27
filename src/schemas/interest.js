const mongoose = require('mongoose');

const interestSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		lastInterest: {
			type: Number,
			default: 0,
		},
		interestTime: {
			type: Number,
			default: 86400000, // 24 hours
		},
		interestRate: {
			type: Number,
			default: 0.01,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('interest', interestSchema, 'interest');
