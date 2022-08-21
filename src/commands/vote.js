const { MessageEmbed } = require("discord.js")
const top = require("top.gg-core")
const { changeDB, readFile, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
require("dotenv").config()
const { Authorization } = process.env

module.exports = {
	aliases: ["voto"],
	category: "Economia",
	description: "Earn falcoins by voting for us on top.gg",
	slash: "both",
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction, message }) => {
		try {
			if (interaction) {
				await interaction.deferReply()
			}
			const topgg = new top.Client(Authorization)

			if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - (await readFile(user.id, "lastVote")) > 43200000
			) {
				await changeDB(user.id, "lastVote", Date.now(), true)
				await changeDB(user.id, "falcoins", 5000)
				var embed = new MessageEmbed()
					.setColor(3066993)
					.addField(
						instance.messageHandler.get(guild, "VOCE_GANHOU"),
						`**5000** falcoins`
					)
					.addField(
						instance.messageHandler.get(guild, "SALDO_ATUAL"),
						`**${await readFile(user.id, "falcoins", true)}** falcoins`
					)
					.setFooter({ text: "by Falcão ❤️" })
			} else if (
				(await topgg.isVoted(user.id)) &&
				Date.now() - (await readFile(user.id, "lastVote")) < 43200000
			) {
				var embed = new MessageEmbed()
					.setColor(15158332)
					.addField(
						instance.messageHandler.get(guild, "ALREADY_COLLECTED"),
						instance.messageHandler.get(guild, "ALREADY_COLLECTED2", {
							TIME: await msToTime(
								43200000 - (Date.now() - (await readFile(user.id, "lastVote")))
							),
						})
					)
					.setFooter({ text: "by Falcão ❤️" })
			} else {
				var embed = new MessageEmbed()
					.setTitle(instance.messageHandler.get(guild, "VOTE_FIRST"))
					.setColor("#0099ff")
					.setDescription(instance.messageHandler.get(guild, "VOTE_HERE"))
					.addField(
						instance.messageHandler.get(guild, "REWARD"),
						instance.messageHandler.get(guild, "VOTE_FINAL")
					)
					.setFooter({ text: "by Falcão ❤️" })
			}
			if (message) {
				return embed
			} else {
				interaction.editReply({ embeds: [embed] })
			}
		} catch (error) {
			console.error(`vote: ${error}`)
		}
	},
}
