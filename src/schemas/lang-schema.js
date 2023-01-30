const mongoose = require("mongoose")

const langSchema = mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			default: "portugues",
			required: true,
		},
	},
	{
		versionKey: false,
	}
)

module.exports = mongoose.model("languages", langSchema, "languages")
