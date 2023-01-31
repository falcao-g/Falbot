const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const {
	format,
	randint,
	changeDB,
	getRoleColor,
	msToTime,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Play scratch-off for a chance to win a huge jackpot",
	slash: true,
	guildOnly: true,
	testOnly,
	init: () => {
		const { Falbot } = require("../../index.js")
	},
	callback: async ({ guild, interaction, user }) => {
		try {
			await interaction.deferReply()
			scratchCooldown = await Falbot.coolSchema.findById(`scratch-${user.id}`)

			if (scratchCooldown) {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "COOLDOWN", {
						COOLDOWN: msToTime(scratchCooldown.cooldown * 1000),
					}),
				})
				return
			}

			newCooldown = 60 * 60 * 8

			const row = new MessageActionRow()
			const row2 = new MessageActionRow()
			const row3 = new MessageActionRow()
			const row4 = new MessageActionRow()
			const row5 = new MessageActionRow()

			rows = [row, row2, row3, row4, row5]
			cr = 0
			for (var i = 1; i < 26; i++) {
				if (i == 6 || i == 11 || i == 16 || i == 21) {
					++cr
				}
				rows[cr].addComponents(
					new MessageButton()
						.setCustomId(String(i))
						.setStyle("SUCCESS")
						.setEmoji("❓")
				)
			}

			var embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields({
					name: Falbot.getMessage(guild, "SCRATCH_TITLE"),
					value: Falbot.getMessage(guild, "SCRATCH_DESCRIPTION"),
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
				var embed = new MessageEmbed().setFooter({ text: "by Falcão ❤️" })

				if (luck === 25) {
					//jackpot
					amount = randint(400000, 500000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor("GOLD").addFields({
						name: Falbot.getMessage(guild, "SCRATCH_PRIZE"),
						value: `${Falbot.getMessage(guild, "SCRATCH_PRIZE_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 16
					collector.stop()
				} else if (luck === 24) {
					//super close
					amount = randint(200000, 400000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: Falbot.getMessage(guild, "SCRATCH_SUPER"),
						value: `${Falbot.getMessage(guild, "SCRATCH_SUPER_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 12
					collector.stop()
				} else if (luck === 23 || luck === 22) {
					//pretty close
					amount = randint(100000, 200000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: Falbot.getMessage(guild, "SCRATCH_PRETTY"),
						value: `${Falbot.getMessage(guild, "SCRATCH_PRETTY_DESCRIPTION", {
							FALCOINS: format(amount),
						})}`,
					})
					cont = 0
					newCooldown = 60 * 60 * 10
					collector.stop()
				} else if (luck === 21 || luck === 20) {
					//kinda close
					amount = randint(50000, 100000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: Falbot.getMessage(guild, "SCRATCH_KINDOF"),
						value: `${Falbot.getMessage(guild, "SCRATCH_KINDOF_DESCRIPTION", {
							FALCOINS: format(amount),
							GUESSES: cont,
						})}`,
					})
				} else {
					//not found but still a chance to win some money
					embed.setColor(15158332)
					if (randint(1, 100) >= 80) {
						amount = randint(25000, 50000)
						await changeDB(user.id, "falcoins", amount)
						embed.addFields({
							name: "Meh...",
							value: `${Falbot.getMessage(guild, "SCRATCH_LOSE_DESCRIPTION2", {
								FALCOINS: format(amount),
								GUESSES: cont,
							})}`,
						})
					} else {
						var lostMessages = Falbot.getMessage(guild, "SCRATCH_LOSE")
						embed.addFields({
							name: lostMessages[randint(0, 5)],
							value: `${Falbot.getMessage(guild, "SCRATCH_LOSE_DESCRIPTION", {
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
				await new Falbot.coolSchema({
					_id: `scratch-${user.id}`,
					name: "scratch",
					type: "per-user",
					cooldown: newCooldown,
				}).save()
			})
		} catch (error) {
			console.error(`scratch: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
