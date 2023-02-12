const { randint } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setNameLocalization("pt-BR", "girarmoeda")
		.setDescription("Flip a coin")
		.setDescriptionLocalization("pt-BR", "Jogue cara ou coroa")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("quantity")
				.setNameLocalization("pt-BR", "quantidade")
				.setDescription("quantity of coins to flip")
				.setDescriptionLocalization("pt-BR", "quantidade de moedas para girar")
				.setMinValue(1)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance }) => {
		await interaction.deferReply()
		try {
			times = interaction.options.getInteger("quantity")
			let caras = randint(0, times)
			let coroas = times - caras

			interaction.editReply({
				content: instance.getMessage(guild, "COINFLIP", {
					CARAS: caras,
					COROAS: coroas,
					TIMES: times,
				}),
			})
		} catch (error) {
			console.error(`Coinflip: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
