const mongoose = require('mongoose');

const lottoSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		prize: {
			type: Number,
			default: 0,
			required: true,
		},
		nextDraw: {
			type: Number,
			default: 0,
			required: true,
		},
		history: {
			type: Array,
			default: [],
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('lottery', lottoSchema, 'lottery');
