const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const builder = require("../utils/snake-builder.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Fun",
	description: "Play a game of snake",
	slash: "both",
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, message, interaction, user }) => {
		try {
			const author = user
			const game = new builder.Game()

			const embed = new MessageEmbed()
				.setTitle(":snake:")
				.addField("\u200b", game.world2string(game.world, game.snake))
				.addField(
					`\u200b`,
					`:alarm_clock: ${game.time}s\n\n${instance.messageHandler.get(
						guild,
						"SCORE"
					)}: ${game.snake.length}`
				)
				.setFooter({ text: "by Falcão ❤️" })
				.setColor("PURPLE")

			const row = new MessageActionRow()
			row.addComponents([
				new MessageButton()
					.setCustomId("up")
					.setEmoji("⬆️")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("left")
					.setEmoji("⬅️")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("right")
					.setEmoji("➡️")
					.setStyle("SECONDARY"),
				new MessageButton()
					.setCustomId("down")
					.setEmoji("⬇️")
					.setStyle("SECONDARY"),
			])

			if (message) {
				var answer = await message.reply({
					embeds: [embed],
					components: [row],
				})
			} else {
				var answer = await interaction.reply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				})
			}

			const filter = (btInt) => {
				return btInt.user.id === author.id
			}

			const collector = answer.createMessageComponentCollector({
				filter,
				time: 1000 * 60 * 60,
			})

			var myTimer = setInterval(async function () {
				if (game.time <= 0) {
					game.snakeMovement(game.snake, game.Sd)
					game.time = 30
				}

				embed.fields[0] = {
					name: "\u200b",
					value: game.world2string(game.world, game.snake),
				}
				embed.fields[1] = {
					name: `\u200b`,
					value: `:alarm_clock: ${game.time}s\n\n${instance.messageHandler.get(
						guild,
						"SCORE"
					)}: ${game.snake.length}`,
				}

				await answer.edit({
					embeds: [embed],
				})
				game.time -= 5
			}, 1000 * 5)

			collector.on("collect", async (i) => {
				if (i.customId === "up") {
					game.snakeMovement(game.snake, "N")
				} else if (i.customId === "left") {
					game.snakeMovement(game.snake, "W")
				} else if (i.customId === "right") {
					game.snakeMovement(game.snake, "E")
				} else if (i.customId === "down") {
					game.snakeMovement(game.snake, "S")
				}

				embed.fields[0] = {
					name: "\u200b",
					value: game.world2string(game.world, game.snake),
				}
				embed.fields[1] = {
					name: `\u200b`,
					value: `:alarm_clock: ${game.time}s\n\n${instance.messageHandler.get(
						guild,
						"SCORE"
					)}: ${game.snake.length}`,
				}

				await i.update({
					embeds: [embed],
					components: [row],
				})

				if (game.gameEnded) {
					clearInterval(myTimer)
					collector.stop()
				}
			})
		} catch (error) {
			console.error(`snake: ${error}`)
		}
	},
}
