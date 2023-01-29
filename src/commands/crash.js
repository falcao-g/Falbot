const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const {
	specialArg,
	readFile,
	getRoleColor,
	randint,
	changeDB,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Sell at the right time before the market crashes",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "falcoins",
			description:
				'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ guild, interaction, user, args }) => {
		await interaction.deferReply()
		try {
			var bet = await specialArg(args[0], user.id, "falcoins")
		} catch {
			await interaction.editReply({
				content: Falbot.getMessage(guild, "VALOR_INVALIDO", {
					VALUE: args[0],
				}),
			})
			return
		}
		if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
			await changeDB(user.id, "falcoins", -bet)
			multiplier = 0.8
			const embed = new MessageEmbed()
				.addFields(
					{
						name: "Crash",
						value: Falbot.getMessage(guild, "CRASH_TEXT"),
						inline: false,
					},
					{
						name: Falbot.getMessage(guild, "MULTIPLIER"),
						value: `${multiplier.toFixed(1)}x`,
						inline: true,
					},
					{
						name: Falbot.getMessage(guild, "GANHOS"),
						value: `:coin: ${parseInt(bet * multiplier - bet)}`,
						inline: true,
					}
				)
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })

			const row = new MessageActionRow().addComponents(
				(sell = new MessageButton()
					.setCustomId("sell")
					.setLabel(Falbot.getMessage(guild, "SELL"))
					.setStyle("DANGER"))
			)

			var answer = await interaction.editReply({
				embeds: [embed],
				components: [row],
				fetchReply: true,
			})

			const filter = (btInt) => {
				return btInt.user.id === user.id
			}

			const collector = answer.createMessageComponentCollector({
				filter,
				max: 1,
			})

			crashed = false
			lost = false

			collector.on("collect", async (i) => {
				crashed = true

				await i.update({
					embeds: [embed],
					components: [row],
				})
			})

			while (!crashed) {
				await new Promise((resolve) => setTimeout(resolve, 2000))

				if (crashed) {
					break
				}

				multiplier += 0.2

				random = randint(1, 100)

				if (random <= 20) {
					crashed = true
					lost = true
				}

				embed.fields[1] = {
					name: Falbot.getMessage(guild, "MULTIPLIER"),
					value: `${multiplier.toFixed(1)}x`,
					inline: true,
				}
				embed.fields[2] = {
					name: Falbot.getMessage(guild, "GANHOS"),
					value: `:coin: ${parseInt(bet * multiplier - bet)}`,
					inline: true,
				}

				await interaction.editReply({
					embeds: [embed],
					components: [row],
				})
			}
			sell.setDisabled(true)

			if (lost) {
				embed.setColor(15158332)
			} else {
				await changeDB(user.id, "falcoins", parseInt(bet * multiplier))
				embed.setColor(3066993)
			}

			await interaction.editReply({
				embeds: [embed],
				components: [row],
			})
		} else {
			await interaction.editReply({
				content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
			})
		}
	},
}
