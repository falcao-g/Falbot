const { randint } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("coinflip")
		.setDescription("Flip a coin")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("quantity")
				.setDescription("quantity of coins to flip")
				.setMinValue(1)
				.setRequired(false)
		),
	execute: async ({ guild, interaction }) => {
		await interaction.deferReply()
		try {
			times = interaction.options.getInteger("quantity")
			let caras = randint(0, times)
			let coroas = times - caras

			interaction.editReply({
				content: Falbot.getMessage(guild, "COINFLIP", {
					CARAS: caras,
					COROAS: coroas,
					TIMES: times,
				}),
			})
		} catch (error) {
			console.error(`Coinflip: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
