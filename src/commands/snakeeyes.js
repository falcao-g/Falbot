const { EmbedBuilder } = require("discord.js")
const {
	specialArg,
	readFile,
	changeDB,
	getRoleColor,
	format,
	randint,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("snakeeyes")
		.setDescription("Roll two dice, if either of them roll a one, you win")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, client, instance, user }) => {
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
			var falcoins = interaction.options.getString("falcoins")

			try {
				var bet = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: falcoins,
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

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: `-------------------\n      | ${diegif} | ${diegif} |\n-------------------`,
						value: `--- **${instance.getMessage(guild, "ROLANDO")}** ---`,
					})
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(guild, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })
				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
					value: `--- **${instance.getMessage(guild, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })

				if (random1 === 1 && random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 5)
					var embed2 = new EmbedBuilder().setColor("GOLD").addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(guild, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(guild, "GANHOS"),
							value: `${format(bet * 5)} falcoins`,
							inline: true,
						}
					)
				} else if (random1 === 1 || random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 2)
					var embed2 = new EmbedBuilder().setColor(3066993).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(guild, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(guild, "GANHOS"),
							value: `${format(bet * 2)} falcoins`,
							inline: true,
						}
					)
				} else {
					var embed2 = new EmbedBuilder().setColor(15158332).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(guild, "VOCE_PERDEU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(guild, "PERDAS"),
							value: `${format(bet)} falcoins`,
							inline: true,
						}
					)
				}
				embed2
					.addFields({
						name: instance.getMessage(guild, "SALDO_ATUAL"),
						value: `${await readFile(user.id, "falcoins", true)}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed2],
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`snakeeyes: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
