const mongoose = require("mongoose")

const interestSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		lastInterest: {
			type: Number,
			default: 0,
			required: true,
		},
		interestTime: {
			type: Number,
			default: 86400000,
			required: true,
		},
		interestRate: {
			type: Number,
			default: 0.1,
			required: true,
		},
	},
	{
		versionKey: false,
	}
)

module.exports = mongoose.model("interest", interestSchema, "interest")
