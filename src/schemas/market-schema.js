const mongoose = require('mongoose');

const marketSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		buyOrders: {
			type: Array,
			default: [],
		},
		sellOrders: {
			type: Array,
			default: [],
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('market', marketSchema, 'market');
