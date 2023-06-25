const math = require("mathjs")
const { getRoleColor } = require("../utils/functions.js")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("math")
		.setNameLocalization("pt-BR", "mat")
		.setDescription("Resolve a mathematical expression")
		.setDescriptionLocalization("pt-BR", "Calcule uma expressão matemática")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("expression")
				.setNameLocalization("pt-BR", "expressão")
				.setDescription("the mathematical expression to be solved")
				.setDescriptionLocalization("pt-BR", "a expressão matemática a ser resolvida")
				.setRequired(true)
				.setAutocomplete(true)
		),
	execute: async ({ interaction, guild, user, instance }) => {
		try {
			await interaction.deferReply()
			const text = interaction.options.getString("expression").replaceAll("**", "^")
			const answer = await math.evaluate(text).toString()

			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.addFields({
					name: instance.getMessage(interaction, "RESULTADO"),
					value: answer,
				})
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`math: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "MATH_ERROR"),
				embeds: [],
			})
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().replaceAll("**", "^")
		try {
			await interaction.respond([
				{
					name: `= ${await math.evaluate(focusedValue)}`,
					value: await math.evaluate(focusedValue).toString(),
				},
			])
		} catch {
			await interaction.respond([
				{
					name: instance.getMessage(interaction, "MATH_ERROR"),
					value: focusedValue,
				},
			])
		}
	},
}
