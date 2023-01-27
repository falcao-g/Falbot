const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	randint,
	changeDB,
	format,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Bet on the roulette",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "type",
			description:
				"the columns have a 2-1 payout ratio, the green has a 35-1 (only one number) and the rest have a 1-1",
			required: true,
			type: "STRING",
			choices: [
				{ name: "black", value: "black" },
				{ name: "red", value: "red" },
				{ name: "green", value: "green" },
				{ name: "high", value: "high" },
				{ name: "low", value: "low" },
				{ name: "even", value: "even" },
				{ name: "odd", value: "odd" },
				{ name: "1st column", value: "first" },
				{ name: "2nd column", value: "second" },
				{ name: "3rd column", value: "third" },
			],
		},
		{
			name: "falcoins",
			description:
				'amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ guild, user, args, interaction, member }) => {
		try {
			await interaction.deferReply()
			try {
				var bet = await specialArg(args[1], user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: args[1],
					}),
				})
			}

			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				await changeDB(user.id, "falcoins", -bet)

				const embed = new MessageEmbed()
					.setTitle(Falbot.getMessage(guild, "ROLETA"))
					.setDescription(Falbot.getMessage(guild, "GIRANDO_ROLETA"))
					.setColor(await getRoleColor(guild, user.id))
					.setImage(
						"https://media3.giphy.com/media/26uf2YTgF5upXUTm0/giphy.gif"
					)
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				const types = {
					green: [0],
					red: [
						1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
					],
					black: [
						2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
					],
					low: [
						0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
					],
					high: [
						19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
						36,
					],
					odd: [
						1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35,
					],
					even: [
						0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34,
						36,
					],
					first: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
					second: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
					third: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
				}

				var type = types[args[0]]
				if (type === types["green"]) {
					var profit = bet * 36
				} else if (
					type === types["first"] ||
					type === types["second"] ||
					type === types["third"]
				) {
					var profit = bet * 3
				} else {
					var profit = bet * 2
				}

				const luck = randint(0, 36)

				await new Promise((resolve) => setTimeout(resolve, 3000))

				var embed2 = new MessageEmbed()
					.setTitle(Falbot.getMessage(guild, "ROLETA"))
					.setAuthor({
						name: member.displayName,
						iconURL: user.avatarURL(),
					})
					.setFooter({ text: "by Falcão ❤️" })

				if (type.includes(luck)) {
					await changeDB(user.id, "falcoins", profit)
					embed2.setColor(3066993).addFields(
						{
							name: Falbot.getMessage(guild, "VOCE_GANHOU") + " :sunglasses:",
							value: Falbot.getMessage(guild, "BOT_ROLOU") + ` **${luck}**`,
							inline: true,
						},
						{
							name: Falbot.getMessage(guild, "GANHOS"),
							value: `${await format(profit)} falcoins`,
							inline: true,
						},
						{
							name: Falbot.getMessage(guild, "SALDO_ATUAL"),
							value: `${await readFile(user.id, "falcoins", true)} falcoins`,
						}
					)
				} else {
					embed2
						.setColor(15158332)

						.addFields(
							{
								name: Falbot.getMessage(guild, "VOCE_PERDEU") + " :pensive:",
								value: Falbot.getMessage(guild, "BOT_ROLOU") + ` **${luck}**`,
								inline: true,
							},
							{
								name: Falbot.getMessage(guild, "PERDAS"),
								value: `${await format(bet)} falcoins`,
								inline: true,
							},
							{
								name: Falbot.getMessage(guild, "SALDO_ATUAL"),
								value: `${await readFile(user.id, "falcoins", true)} falcoins`,
							}
						)
				}

				await interaction.editReply({
					embeds: [embed2],
				})
			} else {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`roulette: ${error}`)
		}
	},
}
