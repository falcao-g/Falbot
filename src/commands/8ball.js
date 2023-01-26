const { MessageEmbed } = require("discord.js")
const { randint, getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

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
	callback: async ({ instance, guild, user, text, interaction }) => {
		try {
			await interaction.deferReply()
			answers = instance.messageHandler.get(guild, "8BALL")
			let answer = `${answers[randint(0, answers.length - 1)]}`
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setAuthor({
					name: instance.messageHandler.get(guild, "BOLA8"),
					iconURL:
						"https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png",
				})
				.addFields(
					{
						name: instance.messageHandler.get(guild, "PERGUNTA"),
						value: text,
					},
					{
						name: instance.messageHandler.get(guild, "PREVISAO"),
						value: answer,
					}
				)
				.setFooter({ text: "by Falcão ❤️" })
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`8ball: ${error}`)
		}
	},
}
