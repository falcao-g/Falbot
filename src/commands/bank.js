const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	takeAndGive,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const levels = require("../utils/json/levels.json")

module.exports = {
	category: "Economia",
	description:
		"Deposit or withdraw your falcoins from the bank, money in the bank increase daily",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "deposit",
			description: "deposit falcoins to the bank",
			type: "SUB_COMMAND",
			options: [
				{
					name: "falcoins",
					description:
						'the amount of falcoins to deposit (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
					type: "STRING",
					required: true,
				},
			],
		},
		{
			name: "withdraw",
			description: "withdraw falcoins from the bank",
			type: "SUB_COMMAND",
			options: [
				{
					name: "falcoins",
					description:
						'the amount of falcoins to withdraw (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
					type: "STRING",
					required: true,
				},
			],
		},
		{
			name: "view",
			description: "view bank balance and other useful stats",
			type: "SUB_COMMAND",
		},
	],
	callback: async ({ instance, guild, user, member, interaction }) => {
		try {
			metodo = interaction.options.getSubcommand()
			falcoins = interaction.options.getString("falcoins")
			var rank_number = await readFile(user.id, "rank")
			var limit = levels[rank_number - 1].bankLimit

			switch (metodo) {
				case "view":
					//send a message with the bank balance
					const embed = new MessageEmbed()
						.setColor(await getRoleColor(guild, user.id))
						.addFields({
							name: ":bank: " + instance.messageHandler.get(guild, "BANCO"),
							value: `**:coin: ${await readFile(
								user.id,
								"banco",
								true
							)} falcoins\n:bank: ${instance.messageHandler.get(
								guild,
								"BANK_INTEREST"
							)}\n\n:money_with_wings: ${await format(
								limit - (await readFile(user.id, "banco"))
							)} ${instance.messageHandler.get(
								guild,
								"BANK_LIMIT"
							)}\n:atm: ${instance.messageHandler.get(
								guild,
								"BANK_DEPOSIT_LIMIT",
								{
									FALCOINS: await format(limit / 2),
								}
							)}**`,
						})
					return embed
				case "deposit":
					try {
						var quantity = await specialArg(falcoins, user.id, "falcoins")
					} catch {
						return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
							VALUE: falcoins,
						})
					}

					if (
						(await readFile(user.id, "falcoins")) >= quantity &&
						quantity > 0
					) {
						if ((await readFile(user.id, "banco")) >= limit / 2) {
							return instance.messageHandler.get(guild, "BANK_OVER_LIMIT")
						}

						if (quantity + (await readFile(user.id, "banco")) > limit / 2) {
							quantity = limit / 2 - (await readFile(user.id, "banco"))
						}

						await takeAndGive(user.id, user.id, "falcoins", "banco", quantity)

						const embed = new MessageEmbed()
							.setTitle(
								instance.messageHandler.get(guild, "BANCO_DEPOSITOU", {
									VALUE: await format(quantity),
								})
							)
							.setColor(await getRoleColor(guild, user.id))
							.setAuthor({
								name: member.displayName,
								iconURL: user.avatarURL(),
							})
							.addField(
								instance.messageHandler.get(guild, "SALDO_ATUAL"),
								`${await readFile(user.id, "falcoins", true)} falcoins`,
								(inline = false)
							)
							.addField(
								instance.messageHandler.get(guild, "BANCO"),
								instance.messageHandler.get(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								})
							)
							.setFooter({ text: "by Falcão ❤️" })

						return embed
					} else {
						return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
					}
				case "withdraw":
					try {
						var quantity = await specialArg(falcoins, user.id, "banco")
					} catch {
						return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
							VALUE: falcoins,
						})
					}

					if ((await readFile(user.id, "banco")) >= quantity && quantity > 0) {
						await takeAndGive(user.id, user.id, "banco", "falcoins", quantity)

						const embed = new MessageEmbed()
							.setTitle(
								instance.messageHandler.get(guild, "BANCO_SACOU", {
									VALUE: await format(quantity),
								})
							)
							.setColor(await getRoleColor(guild, user.id))
							.setAuthor({
								name: member.displayName,
								iconURL: user.avatarURL(),
							})
							.addField(
								instance.messageHandler.get(guild, "SALDO_ATUAL"),
								`${await readFile(user.id, "falcoins", true)} falcoins`,
								(inline = false)
							)
							.addField(
								instance.messageHandler.get(guild, "BANCO"),
								instance.messageHandler.get(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								})
							)
							.setFooter({ text: "by Falcão ❤️" })

						return embed
					} else {
						return instance.messageHandler.get(guild, "BANCO_INSUFICIENTE")
					}
			}
		} catch (error) {
			console.error(`bank: ${error}`)
		}
	},
}
