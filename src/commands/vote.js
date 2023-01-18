const { MessageEmbed } = require("discord.js")
const top = require("top.gg-core")
const {
	changeDB,
	readFile,
	msToTime,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
require("dotenv").config()
const levels = require("../utils/json/levels.json")

module.exports = {
	description: "Earn falcoins by voting for us on top.gg",
	slash: true,
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			const topgg = new top.Client(process.env.Authorization)
			var rank_number = await readFile(user.id, "rank")
			var reward = levels[rank_number - 1].vote
			lastVote = await readFile(user.id, "lastVote")

			if (Date.now() - lastVote > 1000 * 60 * 60 * 72) {
				await changeDB(user.id, "voteStreak", 0, true)
			}

			if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - lastVote > 1000 * 60 * 60 * 12
			) {
				await changeDB(user.id, "lastVote", Date.now(), true)
				await changeDB(user.id, "voteStreak", 1)
				await changeDB(
					user.id,
					"falcoins",
					reward +
						reward * (((await readFile(user.id, "voteStreak")) * 5) / 100)
				)
				var embed = new MessageEmbed()
					.setColor(3066993)
					.addFields({
						name: instance.messageHandler.get(guild, "VOTE_THANKS"),
						value: instance.messageHandler.get(guild, "VOTE_COLLECTED", {
							REWARD: await format(reward),
							PERCENTAGE: (await readFile(user.id, "voteStreak")) * 5,
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - lastVote < 1000 * 60 * 60 * 12
			) {
				var embed = new MessageEmbed()
					.setColor(15158332)
					.addFields({
						name: instance.messageHandler.get(guild, "ALREADY_COLLECTED"),
						value: instance.messageHandler.get(guild, "ALREADY_COLLECTED2", {
							TIME: await msToTime(
								1000 * 60 * 60 * 12 - (Date.now() - lastVote)
							),
							REWARD: await format(reward),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else {
				var embed = new MessageEmbed()
					.setColor("#0099ff")
					.addFields({
						name: instance.messageHandler.get(guild, "VOTE_FIRST"),
						value: instance.messageHandler.get(guild, "VOTE_DESCRIPTION", {
							FALCOINS: await format(reward),
						}),
					})
					.addFields({
						name: instance.messageHandler.get(guild, "VOTE_HERE"),
						value:
							"https://top.gg/bot/742331813539872798/vote\n\n" +
							instance.messageHandler.get(guild, "VOTE_FINAL", {
								PERCENTAGE: (await readFile(user.id, "voteStreak")) * 5,
							}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			}
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`vote: ${error}`)
		}
	},
}
