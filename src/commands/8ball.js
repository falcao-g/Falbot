const { MessageEmbed } = require("discord.js")
const { randint } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Forecast your future",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "question",
			description: "the question you want to ask the 8ball",
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ guild, text, interaction }) => {
		await interaction.deferReply()
		try {
			let answers = Falbot.getMessage(guild, "8BALL")
			let answer = `${answers[randint(0, answers.length - 1)]}`
			const embed = new MessageEmbed()
				.setColor("BLACK")
				.setAuthor({
					name: Falbot.getMessage(guild, "BOLA8"),
					iconURL:
						"https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png",
				})
				.addFields(
					{
						name: Falbot.getMessage(guild, "PERGUNTA"),
						value: text,
					},
					{
						name: Falbot.getMessage(guild, "PREVISAO"),
						value: answer,
					}
				)
				.setFooter({ text: "by Falcão ❤️" })
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`8ball: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
