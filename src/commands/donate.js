const { specialArg, readFile, format, changeDB } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("donate")
		.setNameLocalization("pt-BR", "doar")
		.setDescription("Donate x falcoins to a user")
		.setDescriptionLocalization("pt-BR", "Doe x falcoins para outro usuário")
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuário")
				.setDescription("user to donate to")
				.setDescriptionLocalization("pt-BR", "quem vai receber a doação")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription('amount of falcoins to donate (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		await interaction.deferReply()
		try {
			const falcoins = interaction.options.getString("falcoins")
			var target = interaction.options.getUser("user")
			try {
				var quantity = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= quantity) {
				await changeDB(user.id, "falcoins", -quantity)
				await changeDB(target.id, "falcoins", quantity)
				await interaction.editReply({
					content: instance.getMessage(interaction, "DOAR", {
						FALCOINS: format(quantity),
						USER: target,
					}),
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, "FALCOINS_INSUFICIENTES"),
					ephemeral: true,
				})
			}
		} catch (error) {
			console.error(`donation: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "EXCEPTION"),
			})
		}
	},
}
