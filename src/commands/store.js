const { MessageEmbed } = require("discord.js")
const { getRoleColor, readFile, changeDB } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Show the store",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "item",
			description: "item that you want to buy",
			required: false,
			type: "NUMBER",
			choices: [
				{ name: "crate", value: 1 },
				{ name: "key", value: 2 },
			],
		},
		{
			name: "quantity",
			description: "how many items you want to buy",
			required: false,
			type: "NUMBER",
		},
	],
	callback: async ({ guild, user, args, interaction }) => {
		try {
			await interaction.deferReply()
			if (args[0] === undefined && args[1] === undefined) {
				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setTitle(Falbot.getMessage(guild, "LOJA"))
					.addFields(
						{
							name: Falbot.getMessage(guild, "ITEM_1"),
							value: Falbot.getMessage(guild, "ITEM_1_DESCRICAO"),
							inline: false,
						},
						{
							name: Falbot.getMessage(guild, "ITEM_2"),
							value: Falbot.getMessage(guild, "ITEM_2_DESCRICAO"),
							inline: false,
						},
						{
							name: "\u200b",
							value: Falbot.getMessage(guild, "LOJA_USO_2"),
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed],
				})
			} else {
				item = parseInt(args[0])
				amount = parseInt(args[1])
				if (amount <= 0) {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: args[1],
						}),
					})
					return
				}

				if (item === 1) {
					if ((await readFile(user.id, "falcoins")) >= 5000 * amount) {
						await changeDB(user.id, "falcoins", -5000 * amount)
						await changeDB(user.id, "caixas", 1 * amount)
						await interaction.editReply({
							content: Falbot.getMessage(guild, "LOJA_COMPROU_CAIXA", {
								AMOUNT: amount,
							}),
						})
					} else {
						await interaction.editReply({
							content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
						})
					}
				} else if (item === 2) {
					if ((await readFile(user.id, "falcoins")) >= 20000 * amount) {
						await changeDB(user.id, "falcoins", -20000 * amount)
						await changeDB(user.id, "chaves", 1 * amount)
						await interaction.editReply({
							content: Falbot.getMessage(guild, "LOJA_COMPROU_CHAVE", {
								AMOUNT: amount,
							}),
						})
					} else {
						await interaction.editReply({
							content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
						})
					}
				}
			}
		} catch (error) {
			console.error(`store: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
