const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	takeAndGive,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description:
		"Deposit or withdraw your falcoins from the bank, falcoins in the bank increases daily",
	slash: true,
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
	callback: async ({ guild, user, interaction }) => {
		await interaction.deferReply()
		try {
			metodo = interaction.options.getSubcommand()
			falcoins = interaction.options.getString("falcoins")
			var rank_number = await readFile(user.id, "rank")
			var limit = Falbot.levels[rank_number - 1].bankLimit

			if (metodo === "view") {
				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: ":bank: " + Falbot.getMessage(guild, "BANCO"),
						value: `**:coin: ${await readFile(
							user.id,
							"banco",
							true
						)} falcoins\n:bank: ${Falbot.getMessage(
							guild,
							"BANK_INTEREST"
						)}\n\n:money_with_wings: ${format(
							limit - (await readFile(user.id, "banco"))
						)} ${Falbot.getMessage(
							guild,
							"BANK_LIMIT"
						)}\n:atm: ${Falbot.getMessage(guild, "BANK_DEPOSIT_LIMIT", {
							FALCOINS: format(limit / 2),
						})}**`,
					})
				await interaction.editReply({ embeds: [embed] })
			} else if (metodo === "deposit") {
				try {
					var quantity = await specialArg(falcoins, user.id, "falcoins")
				} catch {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: falcoins,
						}),
					})
					return
				}

				if ((await readFile(user.id, "falcoins")) >= quantity && quantity > 0) {
					if ((await readFile(user.id, "banco")) >= limit / 2) {
						await interaction.editReply({
							content: Falbot.getMessage(guild, "BANK_OVER_LIMIT"),
						})
						return
					}

					if (quantity + (await readFile(user.id, "banco")) > limit / 2) {
						quantity = limit / 2 - (await readFile(user.id, "banco"))
					}

					await takeAndGive(user.id, user.id, "falcoins", "banco", quantity)

					const embed = new MessageEmbed()
						.setTitle(
							Falbot.getMessage(guild, "BANCO_DEPOSITOU", {
								VALUE: format(quantity),
							})
						)
						.setColor(await getRoleColor(guild, user.id))
						.addFields(
							{
								name: Falbot.getMessage(guild, "SALDO_ATUAL"),
								value: `${await readFile(user.id, "falcoins", true)} falcoins`,
							},
							{
								name: Falbot.getMessage(guild, "BANCO"),
								value: Falbot.getMessage(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								}),
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.editReply({ embeds: [embed] })
				} else {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					})
				}
			} else if (metodo === "withdraw") {
				try {
					var quantity = await specialArg(falcoins, user.id, "banco")
				} catch {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: falcoins,
						}),
					})
					return
				}

				if ((await readFile(user.id, "banco")) >= quantity && quantity > 0) {
					await takeAndGive(user.id, user.id, "banco", "falcoins", quantity)

					const embed = new MessageEmbed()
						.setTitle(
							Falbot.getMessage(guild, "BANCO_SACOU", {
								VALUE: format(quantity),
							})
						)
						.setColor(await getRoleColor(guild, user.id))
						.addFields(
							{
								name: Falbot.getMessage(guild, "SALDO_ATUAL"),
								value: `${await readFile(user.id, "falcoins", true)} falcoins`,
							},
							{
								name: Falbot.getMessage(guild, "BANCO"),
								value: Falbot.getMessage(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								}),
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.editReply({ embeds: [embed] })
				} else {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "BANCO_INSUFICIENTE"),
					})
				}
			}
		} catch (error) {
			console.error(`bank: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
