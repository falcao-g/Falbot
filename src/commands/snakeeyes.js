const { MessageEmbed } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	getRoleColor,
	format,
	randint,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Roll two dice, if either of them roll a one, you win",
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
	callback: async ({ guild, interaction, client, user, args, member }) => {
		try {
			await interaction.deferReply()
			guild = client.guilds.cache.get("742332099788275732")
			die1 = await guild.emojis.fetch("1000062195545165895")
			die2 = await guild.emojis.fetch("1000063578797265046")
			die3 = await guild.emojis.fetch("1000063580433023006")
			die4 = await guild.emojis.fetch("1000063582278524969")
			die5 = await guild.emojis.fetch("1000063583893344316")
			die6 = await guild.emojis.fetch("1000063585147428926")
			diegif = await guild.emojis.fetch("999795233808203846")

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
				const choices = [die1, die2, die3, die4, die5, die6]
				random1 = randint(1, 6)
				random2 = randint(1, 6)
				emoji1 = choices[random1 - 1]
				emoji2 = choices[random2 - 1]

				const embed = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setAuthor({ name: member.displayName, iconURL: user.avatarURL() })
					.addFields({
						name: `-------------------\n      | ${diegif} | ${diegif} |\n-------------------`,
						value: `--- **${Falbot.getMessage(guild, "ROLANDO")}** ---`,
					})
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`,
					value: `--- **${Falbot.getMessage(guild, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })
				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
					value: `--- **${Falbot.getMessage(guild, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })

				if (random1 === 1 && random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 5)
					var embed2 = new MessageEmbed().setColor("GOLD").addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${Falbot.getMessage(guild, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: Falbot.getMessage(guild, "GANHOS"),
							value: `${await format(bet * 5)} falcoins`,
							inline: true,
						}
					)
				} else if (random1 === 1 || random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 2)
					var embed2 = new MessageEmbed().setColor(3066993).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${Falbot.getMessage(guild, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: Falbot.getMessage(guild, "GANHOS"),
							value: `${await format(bet * 2)} falcoins`,
							inline: true,
						}
					)
				} else {
					var embed2 = new MessageEmbed().setColor(15158332).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${Falbot.getMessage(guild, "VOCE_PERDEU")}** ---`,
							inline: false,
						},
						{
							name: Falbot.getMessage(guild, "PERDAS"),
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
						name: Falbot.getMessage(guild, "SALDO_ATUAL"),
						value: `${await readFile(user.id, "falcoins", true)}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed2],
				})
			} else {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`snakeeyes: ${error}`)
		}
	},
}
