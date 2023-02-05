const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const {
	format,
	randint,
	changeDB,
	getRoleColor,
	msToTime,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("scratch")
		.setDescription("Play scratch-off for a chance to win a huge jackpot")
		.setDMPermission(false),
	execute: async ({ guild, interaction, instance, user }) => {
		try {
			await interaction.deferReply()
			scratchCooldown = await instance.coolSchema.findById(`scratch-${user.id}`)

			if (scratchCooldown) {
				await interaction.editReply({
					content: instance.getMessage(guild, "COOLDOWN", {
						COOLDOWN: msToTime(scratchCooldown.cooldown * 1000),
					}),
				})
				return
			}

			newCooldown = 60 * 60 * 8

			const row = new ActionRowBuilder()
			const row2 = new ActionRowBuilder()
			const row3 = new ActionRowBuilder()
			const row4 = new ActionRowBuilder()
			const row5 = new ActionRowBuilder()

			rows = [row, row2, row3, row4, row5]
			cr = 0
			for (var i = 1; i < 26; i++) {
				if (i == 6 || i == 11 || i == 16 || i == 21) {
					++cr
				}
				rows[cr].addComponents(
					new ButtonBuilder()
						.setCustomId(String(i))
						.setStyle("Success")
						.setEmoji("❓")
				)
			}

			var embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields({
					name: instance.getMessage(guild, "SCRATCH_TITLE"),
					value: instance.getMessage(guild, "SCRATCH_DESCRIPTION"),
				})

			answer = await interaction.editReply({
				embeds: [embed],
				components: rows,
				fetchReply: true,
			})

			const filter = (btInt) => {
				if (btInt.user.id === user.id) {
					return true
				}
			}

			const collector = answer.createMessageComponentCollector({
				filter,
				max: 6,
				time: 1000 * 60 * 60 * 4,
			})

			collector.on("collect", async (i) => {
				let luck = randint(1, 25)
				cont = 6 - collector.total
				var embed = new EmbedBuilder().setFooter({ text: "by Falcão ❤️" })

				if (luck === 25) {
					//jackpot
					amount = randint(200000, 300000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(15844367).addFields({
						name: instance.getMessage(guild, "SCRATCH_PRIZE"),
						value: `${instance.getMessage(guild, "SCRATCH_PRIZE_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 16
					collector.stop()
				} else if (luck === 24) {
					//super close
					amount = randint(100000, 190000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.getMessage(guild, "SCRATCH_SUPER"),
						value: `${instance.getMessage(guild, "SCRATCH_SUPER_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 12
					collector.stop()
				} else if (luck === 23 || luck === 22) {
					//pretty close
					amount = randint(50000, 90000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.getMessage(guild, "SCRATCH_PRETTY"),
						value: `${instance.getMessage(guild, "SCRATCH_PRETTY_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 10
					collector.stop()
				} else if (luck === 21 || luck === 20) {
					//kinda close
					amount = randint(30000, 45000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.getMessage(guild, "SCRATCH_KINDOF"),
						value: `${instance.getMessage(guild, "SCRATCH_KINDOF_DESCRIPTION", {
							FALCOINS: format(amount),
							GUESSES: cont,
						})}`,
					})
				} else {
					//not found but still a chance to win some money
					embed.setColor(15158332)
					if (randint(1, 100) >= 80) {
						amount = randint(10000, 20000)
						await changeDB(user.id, "falcoins", amount)
						embed.addFields({
							name: "Meh...",
							value: `${instance.getMessage(
								guild,
								"SCRATCH_LOSE_DESCRIPTION2",
								{
									FALCOINS: format(amount),
									GUESSES: cont,
								}
							)}`,
						})
					} else {
						var lostMessages = instance.getMessage(guild, "SCRATCH_LOSE")
						embed.addFields({
							name: lostMessages[randint(0, 5)],
							value: `${instance.getMessage(guild, "SCRATCH_LOSE_DESCRIPTION", {
								GUESSES: cont,
							})}`,
						})
					}
				}

				if (cont != 0) {
					await i.update({
						embeds: [embed],
						components: rows,
					})
				} else {
					await i.update({
						embeds: [embed],
						components: [],
					})
				}
			})

			collector.on("end", async () => {
				await new instance.coolSchema({
					_id: `scratch-${user.id}`,
					name: "scratch",
					type: "per-user",
					cooldown: newCooldown,
				}).save()
			})
		} catch (error) {
			console.error(`scratch: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
