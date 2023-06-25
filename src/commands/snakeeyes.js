const { specialArg, readFile, changeDB, getRoleColor, format, randint } = require("../utils/functions.js")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("snakeeyes")
		.setNameLocalization("pt-BR", "olhoscobra")
		.setDescription("Roll two dice, if either of them roll a one, you win")
		.setDescriptionLocalization("pt-BR", "Role dois dados, se algum dos dois der 1, você ganha")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription('amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, user }) => {
		try {
			await interaction.deferReply()
			const falcoins = interaction.options.getString("falcoins")

			try {
				var bet = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(instance, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
				return
			}

			if ((await readFile(user.id, "falcoins")) >= bet) {
				await changeDB(user.id, "falcoins", -bet)
				const diegif = instance.emojiList["dadogif"]
				const choices = [
					instance.emojiList["dado1"],
					instance.emojiList["dado2"],
					instance.emojiList["dado3"],
					instance.emojiList["dado4"],
					instance.emojiList["dado5"],
					instance.emojiList["dado6"],
				]
				random1 = randint(1, 6)
				random2 = randint(1, 6)
				emoji1 = choices[random1 - 1]
				emoji2 = choices[random2 - 1]

				const embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields({
						name: `-------------------\n      | ${diegif} | ${diegif} |\n-------------------`,
						value: `--- **${instance.getMessage(instance, "ROLANDO")}** ---`,
					})
					.setFooter({ text: "by Falcão ❤️" })

				await interaction.editReply({
					embeds: [embed],
				})

				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${diegif} |\n-------------------`,
					value: `--- **${instance.getMessage(instance, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })
				await new Promise((resolve) => setTimeout(resolve, 1500))
				embed.data.fields[0] = {
					name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
					value: `--- **${instance.getMessage(instance, "ROLANDO")}** ---`,
				}
				await interaction.editReply({ embeds: [embed] })

				if (random1 === 1 && random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 5)
					var embed2 = new EmbedBuilder().setColor("#F1C40F").addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(instance, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(instance, "GANHOS"),
							value: `${format(bet * 5)} falcoins`,
							inline: true,
						}
					)
				} else if (random1 === 1 || random2 === 1) {
					await changeDB(user.id, "falcoins", bet * 2)
					var embed2 = new EmbedBuilder().setColor(3066993).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(instance, "VOCE_GANHOU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(instance, "GANHOS"),
							value: `${format(bet * 2)} falcoins`,
							inline: true,
						}
					)
				} else {
					var embed2 = new EmbedBuilder().setColor(15158332).addFields(
						{
							name: `-------------------\n      | ${emoji1} | ${emoji2} |\n-------------------`,
							value: `--- **${instance.getMessage(instance, "VOCE_PERDEU")}** ---`,
							inline: false,
						},
						{
							name: instance.getMessage(instance, "PERDAS"),
							value: `${format(bet)} falcoins`,
							inline: true,
						}
					)
				}
				embed2
					.addFields({
						name: instance.getMessage(instance, "SALDO_ATUAL"),
						value: `${await readFile(user.id, "falcoins", true)}`,
					})
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed2],
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(instance, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`snakeeyes: ${error}`)
			interaction.editReply({
				content: instance.getMessage(instance, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
