const { MessageEmbed } = require("discord.js")
const {
	readFile,
	changeDB,
	msToTime,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Lottery",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "view",
			description: "View lottery info",
			type: "SUB_COMMAND",
		},
		{
			name: "buy",
			description: "Buy lottery tickets",
			type: "SUB_COMMAND",
			options: [
				{
					name: "amount",
					description: "Amount of lottery tickets to buy",
					required: true,
					type: "NUMBER",
				},
			],
		},
		{
			name: "history",
			description: "See the last 10 winners of the lottery",
			type: "SUB_COMMAND",
		},
	],
	callback: async ({ guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			lotto = await Falbot.lottoSchema.findById("semanal")
			type = interaction.options.getSubcommand()
			if (type === "buy") {
				amount = interaction.options.getNumber("amount")
				if (
					(await readFile(user.id, "falcoins")) > amount * 500 &&
					amount > 0
				) {
					var embed = new MessageEmbed()
						.setColor("GOLD")
						.addFields({
							name:
								`:tickets: ${format(amount)} ` +
								Falbot.getMessage(guild, "PURCHASED"),
							value: Falbot.getMessage(guild, "LOTTERY_COST", {
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
						content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
							VALUE: amount,
						}),
					})
				} else {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
					})
				}
			} else if (type === "view") {
				var embed = new MessageEmbed()
					.setColor("GOLD")
					.addFields(
						{
							name: Falbot.getMessage(guild, "LOTTERY"),
							value: Falbot.getMessage(guild, "LOTTERY_POOL", {
								PRIZE: format(lotto.prize),
							}),
							inline: false,
						},
						{
							name: "Info",
							value: Falbot.getMessage(guild, "LOTTERY_INFO", {
								TIME: msToTime(lotto.nextDraw - Date.now()),
							}),
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })

				if ((await readFile(user.id, "tickets")) > 0) {
					embed.fields[0].value += Falbot.getMessage(guild, "LOTTERY_TICKETS", {
						TICKETS: await readFile(user.id, "tickets", true),
					})
				}

				await interaction.editReply({
					embeds: [embed],
				})
			} else {
				history = ""
				for (winner of lotto.history) {
					history += Falbot.getMessage(guild, "HISTORY", {
						FALCOINS: format(winner.prize),
						USER: winner.winner,
						TICKETS: winner.userTickets,
						TOTAL: winner.totalTickets,
					})
				}

				var embed = new MessageEmbed()
					.setColor("GOLD")
					.setFooter({ text: "by Falcão ❤️" })
					.addFields({
						name: Falbot.getMessage(guild, "LOTTERY_WINNERS"),
						value: history,
					})

				await interaction.editReply({
					embeds: [embed],
				})
			}
		} catch (err) {
			console.error(`lottery: ${err}`)
		}
	},
}
