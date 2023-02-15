const {
	changeDB,
	readFile,
	msToTime,
	format,
} = require("../utils/functions.js")
require("dotenv").config()
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vote")
		.setNameLocalization("pt-BR", "voto")
		.setDescription("Earn falcoins by voting for us on top.gg")
		.setDescriptionLocalization(
			"pt-BR",
			"Ganhe falcois votando no bot no top.gg"
		)
		.setDMPermission(false),
	execute: async ({ guild, user, instance, interaction }) => {
		try {
			await interaction.deferReply()

			var request = await fetch(
				`https://top.gg/api/bots/check?userId=${user.id}`,
				{
					method: "GET",
					headers: {
						Authorization: process.env.Authorization,
					},
				}
			)

			var voted = (await request.json()).voted
			var rank_number = await readFile(user.id, "rank")
			var reward = instance.levels[rank_number - 1].vote
			lastVote = await readFile(user.id, "lastVote")

			if (Date.now() - lastVote > 1000 * 60 * 60 * 48) {
				await changeDB(user.id, "voteStreak", 0, true)
			}

			if (voted && Date.now() - lastVote > 1000 * 60 * 60 * 12) {
				await changeDB(user.id, "lastVote", Date.now(), true)
				await changeDB(user.id, "voteStreak", 1)
				await changeDB(
					user.id,
					"falcoins",
					reward +
						reward * (((await readFile(user.id, "voteStreak")) * 5) / 100)
				)
				var embed = new EmbedBuilder()
					.setColor(3066993)
					.addFields({
						name: instance.getMessage(guild, "VOTE_THANKS"),
						value: instance.getMessage(guild, "VOTE_COLLECTED", {
							REWARD: format(reward),
							PERCENTAGE: (await readFile(user.id, "voteStreak")) * 5,
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else if (voted && Date.now() - lastVote < 1000 * 60 * 60 * 12) {
				var embed = new EmbedBuilder()
					.setColor(15158332)
					.addFields({
						name: instance.getMessage(guild, "ALREADY_COLLECTED"),
						value: instance.getMessage(guild, "ALREADY_COLLECTED2", {
							TIME: msToTime(1000 * 60 * 60 * 12 - (Date.now() - lastVote)),
							REWARD: format(reward),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else {
				var embed = new EmbedBuilder()
					.setColor("#0099ff")
					.addFields({
						name: instance.getMessage(guild, "VOTE_FIRST"),
						value: instance.getMessage(guild, "VOTE_DESCRIPTION", {
							FALCOINS: format(reward),
						}),
					})
					.addFields({
						name: instance.getMessage(guild, "VOTE_HERE"),
						value:
							"https://top.gg/bot/742331813539872798/vote\n\n" +
							instance.getMessage(guild, "VOTE_FINAL", {
								PERCENTAGE: (await readFile(user.id, "voteStreak")) * 5,
							}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			}
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`vote: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
