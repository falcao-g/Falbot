const { randint } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Flip a coin",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "quantity",
			description: "quantity of coins to flip",
			required: false,
			type: "NUMBER",
		},
	],
	callback: async ({ guild, args, interaction }) => {
		try {
			await interaction.deferReply()
			times = args[0] > 0 ? args[0] : -args[0]
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
		}
	},
}
