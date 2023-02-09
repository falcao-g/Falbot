const { EmbedBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	takeAndGive,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bank")
		.setNameLocalization("pt-BR", "banco")
		.setDescription(
			"Deposit or withdraw your falcoins from the bank, falcoins in the bank increases daily"
		)
		.setDescriptionLocalization(
			"pt-BR",
			"Deposite ou saque falcoins do banco, falcoins no banco aumenta diariamente"
		)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("deposit")
				.setNameLocalization("pt-BR", "depositar")
				.setDescription("Deposit falcoins to the bank")
				.setDescriptionLocalization("pt-BR", "Deposite falcoins no banco")
				.addStringOption((option) =>
					option
						.setName("falcoins")
						.setDescription(
							'the amount of falcoins to deposit (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalization(
							"pt-BR",
							'a quantidade de falcoins para depositar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("withdraw")
				.setNameLocalization("pt-BR", "sacar")
				.setDescription("Withdraw falcoins to the bank")
				.setDescriptionLocalization("pt-BR", "Saque falcoins do banco")
				.addStringOption((option) =>
					option
						.setName("falcoins")
						.setDescription(
							'the amount of falcoins to withdraw (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
						)
						.setDescriptionLocalization(
							"pt-BR",
							'a quantidade de falcoins para sacar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("view")
				.setNameLocalization("pt-BR", "ver")
				.setDescription("View bank balance and other useful stats")
				.setDescriptionLocalization(
					"pt-BR",
					"Veja o saldo bancário e outras informações"
				)
		),
	execute: async ({ guild, user, interaction, instance }) => {
		await interaction.deferReply()
		try {
			metodo = interaction.options.getSubcommand()
			falcoins = interaction.options.getString("falcoins")
			var rank_number = await readFile(user.id, "rank")
			var limit = instance.levels[rank_number - 1].bankLimit

			if (metodo === "view") {
				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: ":bank: " + instance.getMessage(guild, "BANCO"),
						value: `**:coin: ${await readFile(
							user.id,
							"banco",
							true
						)} falcoins\n:bank: ${instance.getMessage(
							guild,
							"BANK_INTEREST"
						)}\n\n:money_with_wings: ${format(
							limit - (await readFile(user.id, "banco"))
						)} ${instance.getMessage(
							guild,
							"BANK_LIMIT"
						)}\n:atm: ${instance.getMessage(guild, "BANK_DEPOSIT_LIMIT", {
							FALCOINS: format(limit / 2),
						})}**`,
					})
				await interaction.editReply({ embeds: [embed] })
			} else if (metodo === "deposit") {
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

				if ((await readFile(user.id, "falcoins")) >= quantity && quantity > 0) {
					if ((await readFile(user.id, "banco")) >= limit / 2) {
						await interaction.editReply({
							content: instance.getMessage(guild, "BANK_OVER_LIMIT"),
						})
						return
					}

					if (quantity + (await readFile(user.id, "banco")) > limit / 2) {
						quantity = limit / 2 - (await readFile(user.id, "banco"))
					}

					await takeAndGive(user.id, user.id, "falcoins", "banco", quantity)

					const embed = new EmbedBuilder()
						.setTitle(
							instance.getMessage(guild, "BANCO_DEPOSITOU", {
								VALUE: format(quantity),
							})
						)
						.setColor(await getRoleColor(guild, user.id))
						.addFields(
							{
								name: instance.getMessage(guild, "SALDO_ATUAL"),
								value: `${await readFile(user.id, "falcoins", true)} falcoins`,
							},
							{
								name: instance.getMessage(guild, "BANCO"),
								value: instance.getMessage(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								}),
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.editReply({ embeds: [embed] })
				} else {
					await interaction.editReply({
						content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					})
				}
			} else if (metodo === "withdraw") {
				try {
					var quantity = await specialArg(falcoins, user.id, "banco")
				} catch {
					await interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: falcoins,
						}),
					})
					return
				}

				if ((await readFile(user.id, "banco")) >= quantity && quantity > 0) {
					await takeAndGive(user.id, user.id, "banco", "falcoins", quantity)

					const embed = new EmbedBuilder()
						.setTitle(
							instance.getMessage(guild, "BANCO_SACOU", {
								VALUE: format(quantity),
							})
						)
						.setColor(await getRoleColor(guild, user.id))
						.addFields(
							{
								name: instance.getMessage(guild, "SALDO_ATUAL"),
								value: `${await readFile(user.id, "falcoins", true)} falcoins`,
							},
							{
								name: instance.getMessage(guild, "BANCO"),
								value: instance.getMessage(guild, "BANCO_SALDO", {
									VALUE: await readFile(user.id, "banco", true),
								}),
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.editReply({ embeds: [embed] })
				} else {
					await interaction.editReply({
						content: instance.getMessage(guild, "BANCO_INSUFICIENTE"),
					})
				}
			}
		} catch (error) {
			console.error(`bank: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
