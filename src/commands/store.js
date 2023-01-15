const { MessageEmbed, Interaction } = require("discord.js")
const { getRoleColor, readFile, changeDB } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Show the store",
	slash: true,
	cooldown: "1s",
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
	callback: async ({ instance, guild, user, args, interaction }) => {
		try {
			await interaction.deferReply()
			if (args[0] === undefined && args[1] === undefined) {
				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setTitle(instance.messageHandler.get(guild, "LOJA"))
					.addFields(
						{
							name: instance.messageHandler.get(guild, "ITEM_1"),
							value: instance.messageHandler.get(guild, "ITEM_1_DESCRICAO"),
							inline: false,
						},
						{
							name: instance.messageHandler.get(guild, "ITEM_2"),
							value: instance.messageHandler.get(guild, "ITEM_2_DESCRICAO"),
							inline: false,
						},
						{
							name: "\u200b",
							value: instance.messageHandler.get(guild, "LOJA_USO_2"),
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
						content: instance.messageHandler.get(guild, "VALOR_INVALIDO", {
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
							content: instance.messageHandler.get(
								guild,
								"LOJA_COMPROU_CAIXA",
								{
									AMOUNT: amount,
								}
							),
						})
					} else {
						await interaction.editReply({
							content: instance.messageHandler.get(
								guild,
								"FALCOINS_INSUFICIENTES"
							),
						})
					}
				} else if (item === 2) {
					if ((await readFile(user.id, "falcoins")) >= 20000 * amount) {
						await changeDB(user.id, "falcoins", -20000 * amount)
						await changeDB(user.id, "chaves", 1 * amount)
						await interaction.editReply({
							content: instance.messageHandler.get(
								guild,
								"LOJA_COMPROU_CHAVE",
								{
									AMOUNT: amount,
								}
							),
						})
					} else {
						await interaction.editReply({
							content: instance.messageHandler.get(
								guild,
								"FALCOINS_INSUFICIENTES"
							),
						})
					}
				}
			}
		} catch (error) {
			console.error(`store: ${error}`)
		}
	},
}
