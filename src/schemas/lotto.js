const mongoose = require('mongoose');

const lottoSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		prize: {
			type: Number,
			default: 3000000,
		},
		nextDraw: {
			type: Number,
			default: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
		},
		history: {
			type: Array,
			default: [],
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('lottery', lottoSchema, 'lottery');
