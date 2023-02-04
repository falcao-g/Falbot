const {
	getMember,
	specialArg,
	readFile,
	format,
	takeAndGive,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("donate")
		.setDescription("Donate x falcoins to a user")
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("user to donate to")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'amount of falcoins to donate (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		await interaction.deferReply()
		try {
			falcoins = interaction.options.getString("falcoins")
			target = interaction.options.getUser("user")
			target = await getMember(guild, target.id)
			try {
				var quantity = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= quantity) {
				await takeAndGive(
					user.id,
					target.user.id,
					"falcoins",
					"falcoins",
					quantity
				)
				await interaction.editReply({
					content: instance.getMessage(guild, "DOAR", {
						FALCOINS: format(quantity),
						USER: target,
					}),
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					ephemeral: true,
				})
			}
		} catch (error) {
			console.error(`donation: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
