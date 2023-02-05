const { EmbedBuilder } = require("discord.js")
const {
	readFile,
	changeDB,
	msToTime,
	format,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lottery")
		.setDescription("Lottery")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand.setName("view").setDescription("View lottery info")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("buy")
				.setDescription("Buy lottery tickets")
				.addIntegerOption((option) =>
					option
						.setName("amount")
						.setDescription("Amount of lottery tickets to buy")
						.setMinValue(1)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("history")
				.setDescription("See the last 10 winners of the lottery")
		),
	execute: async ({ guild, user, interaction, instance }) => {
		try {
			await interaction.deferReply()
			lotto = await instance.lottoSchema.findById("semanal")
			type = interaction.options.getSubcommand()
			if (type === "buy") {
				amount = interaction.options.getInteger("amount")
				if (
					(await readFile(user.id, "falcoins")) > amount * 500 &&
					amount > 0
				) {
					var embed = new EmbedBuilder()
						.setColor(15844367)
						.addFields({
							name:
								`:tickets: ${format(amount)} ` +
								instance.getMessage(guild, "PURCHASED"),
							value: instance.getMessage(guild, "LOTTERY_COST", {
								COST: format(amount * 500),
							}),
						})
						.setFooter({ text: "by Falcão ❤️" })

					await changeDB(user.id, "falcoins", -(amount * 500))
					await changeDB(user.id, "tickets", amount)

					await interaction.editReply({
						embeds: [embed],
					})
				} else if (amount <= 0) {
					await interaction.editReply({
						content: instance.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: amount,
						}),
					})
				} else {
					await interaction.editReply({
						content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					})
				}
			} else if (type === "view") {
				var embed = new EmbedBuilder()
					.setColor(15844367)
					.addFields(
						{
							name: instance.getMessage(guild, "LOTTERY"),
							value: instance.getMessage(guild, "LOTTERY_POOL", {
								PRIZE: format(lotto.prize),
							}),
							inline: false,
						},
						{
							name: "Info",
							value: instance.getMessage(guild, "LOTTERY_INFO", {
								TIME: msToTime(lotto.nextDraw - Date.now()),
							}),
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })

				if ((await readFile(user.id, "tickets")) > 0) {
					embed.data.fields[0].value += instance.getMessage(
						guild,
						"LOTTERY_TICKETS",
						{
							TICKETS: await readFile(user.id, "tickets", true),
						}
					)
				}

				await interaction.editReply({
					embeds: [embed],
				})
			} else {
				history = ""
				for (winner of lotto.history) {
					history += instance.getMessage(guild, "HISTORY", {
						FALCOINS: format(winner.prize),
						USER: winner.winner,
						TICKETS: winner.userTickets,
						TOTAL: winner.totalTickets,
					})
				}

				var embed = new EmbedBuilder()
					.setColor(15844367)
					.setFooter({ text: "by Falcão ❤️" })
					.addFields({
						name: instance.getMessage(guild, "LOTTERY_WINNERS"),
						value: history,
					})

				await interaction.editReply({
					embeds: [embed],
				})
			}
		} catch (err) {
			console.error(`lottery: ${err}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
