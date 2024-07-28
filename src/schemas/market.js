const mongoose = require('mongoose');

const order = mongoose.Schema({
	_id: false,
	owner: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const marketSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		buyOrders: [
			{
				type: order,
				default: [],
			},
		],
		sellOrders: [
			{
				type: order,
				default: [],
			},
		],
		history: {
			type: Array,
			default: [],
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('market', marketSchema, 'market');
