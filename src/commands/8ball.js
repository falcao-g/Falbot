const { EmbedBuilder } = require("discord.js")
const { randint } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Forecast your future")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("the question you want to ask the 8ball")
				.setRequired(true)
		),
	execute: async ({ interaction, guild, instance }) => {
		await interaction.deferReply()
		try {
			let answers = instance.getMessage(guild, "8BALL")
			let answer = `${answers[randint(0, answers.length - 1)]}`
			const embed = new EmbedBuilder()
				.setColor("BLACK")
				.setAuthor({
					name: instance.getMessage(guild, "BOLA8"),
					iconURL:
						"https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png",
				})
				.addFields(
					{
						name: instance.getMessage(guild, "PERGUNTA"),
						value: (scope = interaction.options.getString("question")),
					},
					{
						name: instance.getMessage(guild, "PREVISAO"),
						value: answer,
					}
				)
				.setFooter({ text: "by Falcão ❤️" })
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`8ball: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
