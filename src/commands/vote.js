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
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Earn falcoins by voting for us on top.gg")
		.setDMPermission(false),
	init: () => {
		const { Falbot } = require("../../index.js")
	},
	callback: async ({ guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			const topgg = new top.Client(process.env.Authorization)
			var rank_number = await readFile(user.id, "rank")
			var reward = Falbot.levels[rank_number - 1].vote
			lastVote = await readFile(user.id, "lastVote")

			if (Date.now() - lastVote > 1000 * 60 * 60 * 48) {
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
						name: Falbot.getMessage(guild, "VOTE_THANKS"),
						value: Falbot.getMessage(guild, "VOTE_COLLECTED", {
							REWARD: format(reward),
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
						name: Falbot.getMessage(guild, "ALREADY_COLLECTED"),
						value: Falbot.getMessage(guild, "ALREADY_COLLECTED2", {
							TIME: msToTime(1000 * 60 * 60 * 12 - (Date.now() - lastVote)),
							REWARD: format(reward),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else {
				var embed = new MessageEmbed()
					.setColor("#0099ff")
					.addFields({
						name: Falbot.getMessage(guild, "VOTE_FIRST"),
						value: Falbot.getMessage(guild, "VOTE_DESCRIPTION", {
							FALCOINS: format(reward),
						}),
					})
					.addFields({
						name: Falbot.getMessage(guild, "VOTE_HERE"),
						value:
							"https://top.gg/bot/742331813539872798/vote\n\n" +
							Falbot.getMessage(guild, "VOTE_FINAL", {
								PERCENTAGE: (await readFile(user.id, "voteStreak")) * 5,
							}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			}
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`vote: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
