const { MessageEmbed } = require("discord.js")
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
			name: "number",
			description: "number of the item you want to buy",
			required: false,
			type: "NUMBER",
			choices: [
				{ name: 1, value: 1 },
				{ name: 2, value: 2 },
				{ name: 3, value: 3 },
			],
		},
		{
			name: "quantity",
			description: "how many items you want to buy",
			required: false,
			type: "NUMBER",
		},
	],
	callback: async ({ instance, guild, user, args }) => {
		try {
			if (args[0] === undefined && args[1] === undefined) {
				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setTitle("**Loja**")
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
							name: instance.messageHandler.get(guild, "ITEM_3"),
							value: instance.messageHandler.get(guild, "ITEM_3_DESCRICAO"),
							inline: false,
						},
						{
							name: "\u200b",
							value: instance.messageHandler.get(guild, "LOJA_USO_2"),
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
				return embed
			} else {
				item = parseInt(args[0])
				if (item <= 0 || item > 3 || item != item) {
					return instance.messageHandler.get(guild, "LOJA_ITEM_INVALIDO")
				}

				amount = parseInt(args[1] || 1)
				if (amount <= 0 || amount != amount) {
					return instance.messageHandler.get(guild, "LOJA_QUANTIDADE_INVALIDA")
				}

				if (amount > 100) {
					return instance.messageHandler.get(guild, "LOJA_LIMITE")
				}

				if (item === 1) {
					if ((await readFile(user.id, "falcoins")) >= 5000 * amount) {
						for (let i = 0; i < amount; i++) {
							await changeDB(user.id, "falcoins", -5000 * amount)
							await changeDB(user.id, "caixas", 1 * amount)
						}
						return instance.messageHandler.get(guild, "LOJA_COMPROU_CAIXA", {
							AMOUNT: amount,
						})
					} else {
						return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
					}
				} else if (item === 2) {
					if ((await readFile(user.id, "falcoins")) >= 20000 * amount) {
						await changeDB(user.id, "falcoins", -20000 * amount)
						await changeDB(user.id, "chaves", 1 * amount)
						return instance.messageHandler.get(guild, "LOJA_COMPROU_CHAVE", {
							AMOUNT: amount,
						})
					} else {
						return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
					}
				} else if (item === 3) {
					if ((await readFile(user.id, "falcoins")) >= 50000 * amount) {
						await changeDB(user.id, "falcoins", -50000 * amount)
						await changeDB(user.id, "lootbox", 1000 * amount)
						return instance.messageHandler.get(guild, "LOJA_COMPROU_AUMENTO", {
							AMOUNT: amount,
						})
					} else {
						return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
					}
				}
			}
		} catch (error) {
			console.error(`store: ${error}`)
		}
	},
}
