const mongoose = require('mongoose');

const guildsSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		disabledChannels: {
			type: Array,
			default: [],
		},
		disabledCommands: {
			type: Array,
			default: [],
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('guilds', guildsSchema);
