const { specialArg, readFile, getRoleColor, randint, changeDB, format } = require("../utils/functions.js")
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crash")
		.setNameLocalization("pt-BR", "colapso")
		.setDescription("Sell at the right time before the market crashes")
		.setDescriptionLocalization("pt-BR", "Venda no momento certo antes que o mercado colapse")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, user }) => {
		await interaction.deferReply()
		try {
			const falcoins = interaction.options.getString("falcoins")
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
			if ((await readFile(user.id, "falcoins")) >= bet) {
				await changeDB(user.id, "falcoins", -bet)
				multiplier = 10
				const embed = new EmbedBuilder()
					.addFields(
						{
							name: "Crash",
							value: instance.getMessage(guild, "CRASH_TEXT"),
							inline: false,
						},
						{
							name: instance.getMessage(guild, "MULTIPLIER"),
							value: `${(multiplier / 10).toFixed(1)}x`,
							inline: true,
						},
						{
							name: instance.getMessage(guild, "GANHOS"),
							value: `:coin: ${format(parseInt((bet * multiplier) / 10 - bet))}`,
							inline: true,
						}
					)
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				const row = new ActionRowBuilder().addComponents(
					(sell = new ButtonBuilder()
						.setCustomId("sell")
						.setLabel(instance.getMessage(guild, "SELL"))
						.setStyle("Danger"))
				)

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				})

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === user.id
				}

				const collector = answer.createMessageComponentCollector({
					filter,
					max: 1,
				})

				var crashed = false
				var lost = false

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

					multiplier += 2

					random = randint(1, 100)

					if (random <= 20) {
						crashed = true
						lost = true
					}

					embed.data.fields[1] = {
						name: instance.getMessage(guild, "MULTIPLIER"),
						value: `${(multiplier / 10).toFixed(1)}x`,
						inline: true,
					}
					embed.data.fields[2] = {
						name: instance.getMessage(guild, "GANHOS"),
						value: `:coin: ${format(parseInt((bet * multiplier) / 10 - bet))}`,
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
					await changeDB(user.id, "falcoins", parseInt((bet * multiplier) / 10))
					embed.setColor(3066993)
				}

				await interaction.editReply({
					embeds: [embed],
					components: [row],
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`catch: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
