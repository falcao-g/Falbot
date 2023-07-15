const mongoose = require('mongoose');

const bannedSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model('banned-list', bannedSchema, 'banned-list');
