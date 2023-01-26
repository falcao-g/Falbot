const { MessageEmbed } = require("discord.js")
const pick = require("pick-random-weighted")
const {
	specialArg,
	readFile,
	changeDB,
	getRoleColor,
	count,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Bet your money in the slot machine",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "falcoins",
			description:
				'amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
			required: true,
			type: "STRING",
		},
	],
	callback: async ({
		instance,
		guild,
		interaction,
		client,
		user,
		args,
		member,
	}) => {
		try {
			await interaction.deferReply()
			guild = client.guilds.cache.get("742332099788275732")
			emojifoda = await guild.emojis.fetch("926953352774963310")
			try {
				var bet = await specialArg(args[0], user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "VALOR_INVALIDO", {
						VALUE: args[0],
					}),
				})
				return
			}
			if ((await readFile(user.id, "falcoins")) >= bet && bet > 0) {
				await changeDB(user.id, "falcoins", -bet)
				const choices = [
					[":money_mouth:", 30],
					[":gem:", 10],
					[":moneybag:", 15],
					[":coin:", 25],
					[":dollar:", 20],
				]
				const emoji1 = pick(choices)
				const emoji2 = pick(choices)
				const emoji3 = pick(choices)

				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setAuthor({ name: member.displayName, iconURL: user.avatarURL() })
					.addFields({
						name: `-------------------\n | ${emojifoda} | ${emojifoda} | ${emojifoda} |\n-------------------`,
						value: `--- **${instance.messageHandler.get(
							guild,
							"GIRANDO"
						)}** ---`,
					})
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.fields[0] = {
					name: `-------------------\n | ${emoji1} | ${emojifoda} | ${emojifoda} |\n-------------------`,
					value: `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })
				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.fields[0] = {
					name: `-------------------\n | ${emoji1} | ${emoji2} | ${emojifoda} |\n-------------------`,
					value: `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })
				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.fields[0] = {
					name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
					value: `--- **${instance.messageHandler.get(guild, "GIRANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })

				arrayEmojis = [emoji1, emoji2, emoji3]
				var dollar = await count(arrayEmojis, ":dollar:")
				var coin = await count(arrayEmojis, ":coin:")
				var moneybag = await count(arrayEmojis, ":moneybag:")
				var gem = await count(arrayEmojis, ":gem:")
				var money_mouth = await count(arrayEmojis, ":money_mouth:")

				if (dollar == 3) {
					var winnings = 3
				} else if (coin == 3) {
					var winnings = 2.5
				} else if (moneybag == 3) {
					var winnings = 7
				} else if (gem == 3) {
					var winnings = 10
				} else if (money_mouth == 3) {
					var winnings = 2.5
				} else if (dollar == 2) {
					var winnings = 2
				} else if (coin == 2) {
					var winnings = 2
				} else if (moneybag == 2) {
					var winnings = 3
				} else if (gem == 2) {
					var winnings = 5
				} else if (money_mouth == 2) {
					var winnings = 0.5
				}
				var profit = parseInt(bet * winnings)

				if (profit > 0) {
					await changeDB(user.id, "falcoins", profit)
					var embed2 = new MessageEmbed().setColor(3066993).addFields(
						{
							name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
							value: `--- **${instance.messageHandler.get(
								guild,
								"VOCE_GANHOU"
							)}** ---`,
							inline: false,
						},
						{
							name: instance.messageHandler.get(guild, "GANHOS"),
							value: `${await format(profit)} falcoins`,
							inline: true,
						}
					)
				} else {
					var embed2 = new MessageEmbed().setColor(15158332).addFields(
						{
							name: `-------------------\n | ${emoji1} | ${emoji2} | ${emoji3} |\n-------------------`,
							value: `--- **${instance.messageHandler.get(
								guild,
								"VOCE_PERDEU"
							)}** ---`,
							inline: false,
						},
						{
							name: instance.messageHandler.get(guild, "PERDAS"),
							value: `${await format(bet)} falcoins`,
							inline: true,
						}
					)
				}
				embed2
					.setAuthor({
						name: member.displayName,
						iconURL: user.avatarURL(),
					})
					.addFields({
						name: instance.messageHandler.get(guild, "SALDO_ATUAL"),
						value: `${await readFile(user.id, "falcoins", true)}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed2],
				})
			} else {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`slot: ${error}`)
		}
	},
}
