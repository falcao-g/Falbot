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
	callback: async ({ instance, guild, args, interaction }) => {
		try {
			await interaction.deferReply()
			times = parseInt(args[0]) || 1
			if (times <= 1000) {
				let caras = 0
				let coroas = 0
				for (var i = 0; i < times; i++) {
					if (Math.random() > 0.5) {
						caras = ++caras
					} else {
						coroas = ++coroas
					}
				}

				interaction.editReply({
					content: instance.messageHandler.get(guild, "COINFLIP", {
						CARAS: caras,
						COROAS: coroas,
						TIMES: times,
					}),
				})
			} else {
				interaction.editReply({
					content: instance.messageHandler.get(guild, "COINFLIP_LIMITE"),
				})
			}
		} catch (error) {
			console.error(`Coinflip: ${error}`)
		}
	},
}
