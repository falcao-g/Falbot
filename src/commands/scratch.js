const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const {
	format,
	randint,
	changeDB,
	getRoleColor,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Play scratch-off for a chance to win a huge jackpot",
	slash: true,
	cooldown: "8h",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, interaction, user }) => {
		try {
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
					name: instance.messageHandler.get(guild, "SCRATCH_TITLE"),
					value: instance.messageHandler.get(guild, "SCRATCH_DESCRIPTION"),
				})

			answer = await interaction.reply({
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
						name: instance.messageHandler.get(guild, "SCRATCH_PRIZE"),
						value: `${instance.messageHandler.get(
							guild,
							"SCRATCH_PRIZE_DESCRIPTION",
							{ FALCOINS: await format(amount) }
						)}`,
					})
					cont = 0
					collector.stop()
				} else if (luck === 24) {
					//super close
					amount = randint(200000, 400000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.messageHandler.get(guild, "SCRATCH_SUPER"),
						value: `${instance.messageHandler.get(
							guild,
							"SCRATCH_SUPER_DESCRIPTION",
							{ FALCOINS: await format(amount) }
						)}`,
					})
					cont = 0
					collector.stop()
				} else if (luck === 23 || luck === 22) {
					//pretty close
					amount = randint(100000, 200000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.messageHandler.get(guild, "SCRATCH_PRETTY"),
						value: `${instance.messageHandler.get(
							guild,
							"SCRATCH_PRETTY_DESCRIPTION",
							{ FALCOINS: await format(amount) }
						)}`,
					})
					cont = 0
					collector.stop()
				} else if (luck === 21 || luck === 20) {
					//kinda close
					amount = randint(50000, 100000)
					await changeDB(user.id, "falcoins", amount)
					embed.setColor(3066993).addFields({
						name: instance.messageHandler.get(guild, "SCRATCH_KINDOF"),
						value: `${instance.messageHandler.get(
							guild,
							"SCRATCH_KINDOF_DESCRIPTION",
							{ FALCOINS: await format(amount), GUESSES: cont }
						)}`,
					})
				} else {
					//not found but still a chance to win some money
					embed.setColor(15158332)
					if (randint(1, 100) >= 80) {
						amount = randint(25000, 50000)
						await changeDB(user.id, "falcoins", amount)
						embed.addFields({
							name: "Meh...",
							value: `${instance.messageHandler.get(
								guild,
								"SCRATCH_LOSE_DESCRIPTION2",
								{ FALCOINS: await format(amount), GUESSES: cont }
							)}`,
						})
					} else {
						var lostMessages = instance.messageHandler.get(
							guild,
							"SCRATCH_LOSE"
						)
						embed.addFields({
							name: lostMessages[randint(0, 5)],
							value: `${instance.messageHandler.get(
								guild,
								"SCRATCH_LOSE_DESCRIPTION",
								{ GUESSES: cont }
							)}`,
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
		} catch (error) {
			console.error(`scratch: ${error}`)
		}
	},
}
