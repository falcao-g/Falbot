const mongoose = require("mongoose")

const reqString = {
	type: String,
	required: true,
}

const userSchema = mongoose.Schema(
	{
		_id: reqString,
		falcoins: {
			type: Number,
			default: 10000,
		},
		vitorias: {
			type: Number,
			default: 0,
		},
		banco: {
			type: Number,
			default: 0,
		},
		caixas: {
			type: Number,
			default: 0,
		},
		chaves: {
			type: Number,
			default: 0,
		},
		lastVote: {
			type: Number,
			default: 0,
		},
		rank: {
			type: Number,
			default: 1,
		},
		voteReminder: {
			type: Boolean,
			default: false,
		},
		lastReminder: {
			type: Number,
			default: 0,
		},
		tickets: {
			type: Number,
			default: 0,
		},
		voteStreak: {
			type: Number,
			default: 0,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

module.exports = mongoose.model("users", userSchema)
