const { EmbedBuilder } = require("discord.js")
const { getRoleColor, readFile, changeDB } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("store")
		.setNameLocalization("pt-BR", "loja")
		.setDescription("Show the store")
		.setDescriptionLocalization("pt-BR", "Mostra a loja")
		.setDMPermission(false)
		.addIntegerOption((option) =>
			option
				.setName("item")
				.setDescription("item that you want to buy")
				.setDescriptionLocalization("pt-BR", "item que você quer comprar")
				.setRequired(false)
				.addChoices({ name: "crate", value: 1 }, { name: "key", value: 2 })
		)
		.addIntegerOption((option) =>
			option
				.setName("quantity")
				.setNameLocalization("pt-BR", "quantidade")
				.setDescription("how many items you want to buy")
				.setDescriptionLocalization(
					"pt-BR",
					"a quantidade de items que você quer comprar"
				)
				.setMinValue(1)
				.setRequired(false)
		),
	execute: async ({ guild, user, instance, interaction }) => {
		try {
			await interaction.deferReply()
			var item = interaction.options.getInteger("item")
			var quantity = interaction.options.getInteger("quantity")
			if (item === null && quantity === null) {
				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.setTitle(instance.getMessage(guild, "LOJA"))
					.addFields(
						{
							name: instance.getMessage(guild, "ITEM_1"),
							value: instance.getMessage(guild, "ITEM_1_DESCRICAO"),
							inline: false,
						},
						{
							name: instance.getMessage(guild, "ITEM_2"),
							value: instance.getMessage(guild, "ITEM_2_DESCRICAO"),
							inline: false,
						},
						{
							name: "\u200b",
							value: instance.getMessage(guild, "LOJA_USO_2"),
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed],
				})
			} else {
				item = parseInt(item)
				amount = parseInt(quantity)

				if (item === 1) {
					if ((await readFile(user.id, "falcoins")) >= 5000 * amount) {
						await changeDB(user.id, "falcoins", -5000 * amount)
						await changeDB(user.id, "caixas", 1 * amount)
						await interaction.editReply({
							content: instance.getMessage(guild, "LOJA_COMPROU_CAIXA", {
								AMOUNT: amount,
							}),
						})
					} else {
						await interaction.editReply({
							content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
						})
					}
				} else if (item === 2) {
					if ((await readFile(user.id, "falcoins")) >= 20000 * amount) {
						await changeDB(user.id, "falcoins", -20000 * amount)
						await changeDB(user.id, "chaves", 1 * amount)
						await interaction.editReply({
							content: instance.getMessage(guild, "LOJA_COMPROU_CHAVE", {
								AMOUNT: amount,
							}),
						})
					} else {
						await interaction.editReply({
							content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
						})
					}
				}
			}
		} catch (error) {
			console.error(`store: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
