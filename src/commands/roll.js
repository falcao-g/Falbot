const { rollDice } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setNameLocalization("pt-BR", "rolar")
		.setDescription("Roll dice for you")
		.setDescriptionLocalization("pt-BR", "Rola dados para você")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("dice")
				.setNameLocalization("pt-BR", "dados")
				.setDescription("dice to be rolled")
				.setDescriptionLocalization("pt-BR", "dados a serem rolados")
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		try {
			await interaction.deferReply()
			text = interaction.options.getString("dice")

			try {
				var rolled = rollDice(text)
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: text,
					}),
				})
			}
			await interaction.editReply({
				content: `**${instance.getMessage(guild, "RESULTADO")}:** ${rolled}`,
			})
		} catch (error) {
			console.error(`roll: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
