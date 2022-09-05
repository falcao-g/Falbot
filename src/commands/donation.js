const {
	getMember,
	specialArg,
	readFile,
	format,
	takeAndGive,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Donate x falcoins to a user",
	slash: true,
	cooldown: "1s",
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
	callback: async ({ instance, guild, interaction, user, args }) => {
		try {
			args[0] = await getMember(guild, args[0])

			try {
				var quantity = await specialArg(args[1], user.id, "falcoins")
			} catch {
				return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
					VALUE: args[1],
				})
			}

			if ((await readFile(user.id, "falcoins")) >= quantity) {
				await takeAndGive(
					user.id,
					args[0].user.id,
					"falcoins",
					"falcoins",
					quantity
				)
				return instance.messageHandler.get(guild, "DOAR", {
					FALCOINS: await format(quantity),
					USER: args[0],
				})
			} else {
				interaction.reply({
					content: instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES"),
					ephemeral: true,
				})
			}
		} catch (error) {
			console.error(`donation: ${error}`)
		}
	},
}
