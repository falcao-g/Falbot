const {
	getMember,
	specialArg,
	readFile,
	format,
	takeAndGive,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Donate x falcoins to a user",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "user",
			description: "user to donate to",
			required: true,
			type: "USER",
		},
		{
			name: "falcoins",
			description:
				'amount of falcoins to donate (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ guild, interaction, user, args }) => {
		await interaction.deferReply()
		try {
			args[0] = await getMember(guild, args[0])

			try {
				var quantity = await specialArg(args[1], user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: args[1],
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= quantity) {
				await takeAndGive(
					user.id,
					args[0].user.id,
					"falcoins",
					"falcoins",
					quantity
				)
				await interaction.editReply({
					content: Falbot.getMessage(guild, "DOAR", {
						FALCOINS: format(quantity),
						USER: args[0],
					}),
				})
			} else {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					ephemeral: true,
				})
			}
		} catch (error) {
			console.error(`donation: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
