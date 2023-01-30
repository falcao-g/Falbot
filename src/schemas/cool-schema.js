const mongoose = require("mongoose")

const coolSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		cooldown: {
			type: Number,
			default: 0,
			required: true,
		},
	},
	{
		versionKey: false,
	}
)

module.exports = mongoose.model("cooldowns", coolSchema, "cooldowns")
