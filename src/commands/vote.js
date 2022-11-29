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
const { Authorization } = process.env
const levels = require("../utils/json/levels.json")

module.exports = {
	category: "Economia",
	description: "Earn falcoins by voting for us on top.gg",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			const topgg = new top.Client(Authorization)
			var rank_number = await readFile(user.id, "rank")
			var reward = levels[rank_number - 1].vote

			if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - (await readFile(user.id, "lastVote")) > 43200000
			) {
				await changeDB(user.id, "lastVote", Date.now(), true)
				await changeDB(user.id, "falcoins", reward)
				var embed = new MessageEmbed()
					.setColor(3066993)
					.addFields(
						{
							name: instance.messageHandler.get(guild, "VOCE_GANHOU"),
							value: `**${await format(reward)}** falcoins`,
						},
						{
							name: instance.messageHandler.get(guild, "SALDO_ATUAL"),
							value: `**${await readFile(
								user.id,
								"falcoins",
								true
							)}** falcoins`,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
			} else if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - (await readFile(user.id, "lastVote")) < 43200000
			) {
				var embed = new MessageEmbed()
					.setColor(15158332)
					.addFields({
						name: instance.messageHandler.get(guild, "ALREADY_COLLECTED"),
						value: instance.messageHandler.get(guild, "ALREADY_COLLECTED2", {
							TIME: await msToTime(
								43200000 - (Date.now() - (await readFile(user.id, "lastVote")))
							),
							REWARD: await format(reward),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			} else {
				var embed = new MessageEmbed()
					.setTitle(instance.messageHandler.get(guild, "VOTE_FIRST"))
					.setColor("#0099ff")
					.setDescription(instance.messageHandler.get(guild, "VOTE_HERE"))
					.addFields({
						name: instance.messageHandler.get(guild, "REWARD"),
						value: instance.messageHandler.get(guild, "VOTE_FINAL", {
							REWARD: await format(reward),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })
			}
			interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`vote: ${error}`)
		}
	},
}
