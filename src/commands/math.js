const { EmbedBuilder } = require("discord.js")
const math = require("mathjs")
const { getRoleColor } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("math")
		.setDescription("Resolve a mathematical expression")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("expression")
				.setDescription("the mathematical expression to be solved")
				.setRequired(true)
		),
	execute: async ({ interaction, guild, user, instance }) => {
		try {
			await interaction.deferReply()
			text = interaction.options.getString("expression").replaceAll("**", "^")
			answer = await math.evaluate(text).toString()

			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.addFields({
					name: instance.getMessage(guild, "RESULTADO"),
					value: answer,
				})
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`math: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
