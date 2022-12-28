const { MessageActionRow, MessageButton } = require("discord.js")
const Board = require("tictactoe-board")
const {
	getMember,
	specialArg,
	readFile,
	format,
	randint,
	changeDB,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Challenge someone to a game of tic tac toe",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "user",
			description: "user to challenge",
			required: true,
			type: "USER",
		},
		{
			name: "falcoins",
			description:
				'amount of falcoins to bet in the game (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)',
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
			var board = new Board.default()
			const member2 = await getMember(guild, args[0])
			if (member2 != member) {
				try {
					var bet = await specialArg(args[1], user.id, "falcoins")
				} catch {
					await interaction.editReply({
						content: instance.messageHandler.get(guild, "VALOR_INVALIDO", {
							VALUE: args[1],
						}),
					})
					return
				}
				if (
					(await readFile(member.user.id, "falcoins")) >= bet &&
					(await readFile(member2.user.id, "falcoins")) >= bet &&
					bet > 0
				) {
					var answer = await interaction.editReply({
						content: instance.messageHandler.get(guild, "VELHA_CHAMOU", {
							USER: member.displayName,
							USER2: member2.displayName,
							FALCOINS: await format(bet),
						}),
						fetchReply: true,
					})

					answer.react("✅")
					answer.react("🚫")

					const filter = (reaction, user) => {
						return user.id === member2.user.id && user.id !== client.user.id
					}

					const collector = answer.createReactionCollector({
						filter,
						max: 1,
						time: 1000 * 300,
					})

					collector.on("end", async (collected) => {
						if (collected.size === 0) {
							await interaction.followUp({
								content: instance.messageHandler.get(
									guild,
									"VELHA_CANCELADO_DEMOROU",
									{ USER: member2 }
								),
							})
						} else if (collected.first()._emoji.name === "🚫") {
							await interaction.followUp({
								content: instance.messageHandler.get(
									guild,
									"VELHA_CANCELADO_RECUSOU",
									{ USER: member2 }
								),
							})
						} else {
							await changeDB(member.user.id, "falcoins", -bet)
							await changeDB(member2.user.id, "falcoins", -bet)
							const row = new MessageActionRow()
							const row2 = new MessageActionRow()
							const row3 = new MessageActionRow()

							customIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
							for (var i = 0; i < 9; i++) {
								if (i < 3) {
									row.addComponents(
										new MessageButton()
											.setCustomId(customIds[i])
											.setLabel("\u200b")
											.setStyle("SECONDARY")
									)
								} else if (i < 6) {
									row2.addComponents(
										new MessageButton()
											.setCustomId(customIds[i])
											.setLabel("\u200b")
											.setStyle("SECONDARY")
									)
								} else {
									row3.addComponents(
										new MessageButton()
											.setCustomId(customIds[i])
											.setLabel("\u200b")
											.setStyle("SECONDARY")
									)
								}
							}

							//randomizing who starts
							let first_player
							let second_player
							let random = randint(0, 1)
							if (random == 0) {
								first_player = member
								second_player = member2
							} else {
								first_player = member2
								second_player = member
							}

							answer2 = await interaction.followUp({
								content: `:older_woman: \`${member.displayName}\` **VS**  \`${
									member2.displayName
								}\` \n\n${instance.messageHandler.get(
									guild,
									"VELHA_MOVIMENTO",
									{ USER: first_player.displayName }
								)}`,
								components: [row, row2, row3],
								fetchReply: true,
							})

							const filter2 = (btInt) => {
								if (
									btInt.user.id === first_player.user.id &&
									btInt.user.id !== client.user.id &&
									board.currentMark() === "X"
								) {
									return true
								} else if (
									btInt.user.id === second_player.user.id &&
									btInt.user.id !== client.user.id &&
									board.currentMark() === "O"
								) {
									return true
								}
							}

							const collector2 = answer2.createMessageComponentCollector({
								filter: filter2,
								max: 9,
								time: 1000 * 60 * 60,
							})

							collector2.on("collect", async (i) => {
								if (i.customId === "1") {
									row.components[0].setLabel(board.currentMark())
									i.user.id === member.id
										? row.components[0].setStyle("PRIMARY")
										: row.components[0].setStyle("DANGER")
									row.components[0].setDisabled(true)
									board = board.makeMove(1, board.currentMark())
								} else if (i.customId === "2") {
									row.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row.components[1].setStyle("PRIMARY")
										: row.components[1].setStyle("DANGER")
									row.components[1].setDisabled(true)
									board = board.makeMove(2, board.currentMark())
								} else if (i.customId === "3") {
									row.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row.components[2].setStyle("PRIMARY")
										: row.components[2].setStyle("DANGER")
									row.components[2].setDisabled(true)
									board = board.makeMove(3, board.currentMark())
								} else if (i.customId === "4") {
									row2.components[0].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[0].setStyle("PRIMARY")
										: row2.components[0].setStyle("DANGER")
									row2.components[0].setDisabled(true)
									board = board.makeMove(4, board.currentMark())
								} else if (i.customId === "5") {
									row2.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[1].setStyle("PRIMARY")
										: row2.components[1].setStyle("DANGER")
									row2.components[1].setDisabled(true)
									board = board.makeMove(5, board.currentMark())
								} else if (i.customId === "6") {
									row2.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[2].setStyle("PRIMARY")
										: row2.components[2].setStyle("DANGER")
									row2.components[2].setDisabled(true)
									board = board.makeMove(6, board.currentMark())
								} else if (i.customId === "7") {
									row3.components[0].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[0].setStyle("PRIMARY")
										: row3.components[0].setStyle("DANGER")
									row3.components[0].setDisabled(true)
									board = board.makeMove(7, board.currentMark())
								} else if (i.customId === "8") {
									row3.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[1].setStyle("PRIMARY")
										: row3.components[1].setStyle("DANGER")
									row3.components[1].setDisabled(true)
									board = board.makeMove(8, board.currentMark())
								} else if (i.customId === "9") {
									row3.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[2].setStyle("PRIMARY")
										: row3.components[2].setStyle("DANGER")
									row3.components[2].setDisabled(true)
									board = board.makeMove(9, board.currentMark())
								}

								await i.update({
									content: `:older_woman: \`${member.displayName}\` **VS**  \`${
										member2.displayName
									}\` \n\n${instance.messageHandler.get(
										guild,
										"VELHA_MOVIMENTO",
										{
											USER:
												board.currentMark() === "X"
													? first_player.displayName
													: second_player.displayName,
										}
									)}`,
									components: [row, row2, row3],
								})

								if (board.isGameOver()) {
									collector2.stop()
								}
							})

							collector2.on("end", async () => {
								if (board.hasWinner()) {
									if (board.winningPlayer() === "X") {
										await changeDB(first_player.user.id, "falcoins", bet * 2)
										await changeDB(first_player.user.id, "vitorias", 1)
									} else {
										await changeDB(second_player.user.id, "falcoins", bet * 2)
										await changeDB(second_player.user.id, "vitorias", 1)
									}
									await answer2.edit({
										content: `:older_woman: \`${
											member.displayName
										}\` **VS**  \`${
											member2.displayName
										}\` \n\n**${instance.messageHandler.get(guild, "GANHOU", {
											WINNER:
												board.winningPlayer() === "X"
													? first_player.displayName
													: second_player.displayName,
											FALCOINS: bet,
										})}**`,
									})
								} else {
									await changeDB(first_player.user.id, "falcoins", bet)
									await changeDB(second_player.user.id, "falcoins", bet)
									await answer2.edit({
										content: `:older_woman: \`${
											member.displayName
										}\` **VS**  \`${
											member2.displayName
										}\` \n\n${instance.messageHandler.get(
											guild,
											"VELHA_EMPATOU"
										)}`,
									})
								}
							})
						}
					})
				} else {
					await interaction.editReply({
						content: instance.messageHandler.get(guild, "INSUFICIENTE_CONTAS"),
					})
				}
			} else {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "NAO_JOGAR_SOZINHO"),
				})
			}
		} catch (error) {
			console.error(`velha: ${error}`)
		}
	},
}
