const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const Board = require("tictactoe-board")
const {
	getMember,
	specialArg,
	readFile,
	format,
	randint,
	changeDB,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("tictactoe")
		.setNameLocalization("pt-BR", "velha")
		.setDescription("Challenge someone to a game of tic tac toe")
		.setDescriptionLocalization(
			"pt-BR",
			"Desafie outro usuário para um jogo da velha"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuário")
				.setDescription("user to challenge")
				.setDescriptionLocalization("pt-BR", "usuário para desafiar")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'amount of falcoins to bet in the game (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, user, member }) => {
		try {
			await interaction.deferReply()
			var board = new Board.default()
			const member2 = await getMember(
				guild,
				interaction.options.getUser("user").id
			)
			var falcoins = interaction.options.getString("falcoins")
			if (member2 != member) {
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
				if (
					(await readFile(member.user.id, "falcoins")) >= bet &&
					(await readFile(member2.user.id, "falcoins")) >= bet &&
					bet > 0
				) {
					const row4 = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId("join")
							.setEmoji("✅")
							.setStyle("Success"),
						new ButtonBuilder()
							.setCustomId("refuse")
							.setEmoji("⛔")
							.setStyle("Danger"),
					])
					var answer = await interaction.editReply({
						content: instance.getMessage(guild, "VELHA_CHAMOU", {
							USER: member,
							USER2: member2,
							FALCOINS: format(bet),
						}),
						components: [row4],
						fetchReply: true,
					})

					const filter = (btInt) => {
						return (
							btInt.user.id === member2.user.id &&
							!btInt.user.bot &&
							!instance._banned.includes(btInt.user.id)
						)
					}

					const collector = answer.createMessageComponentCollector({
						filter,
						max: 1,
						time: 1000 * 300,
					})

					collector.on("end", async (collected) => {
						if (collected.size === 0) {
							await interaction.followUp({
								content: instance.getMessage(guild, "VELHA_CANCELADO_DEMOROU", {
									USER: member2,
								}),
							})
						} else if (collected.first().customId === "refuse") {
							await interaction.followUp({
								content: instance.getMessage(guild, "VELHA_CANCELADO_RECUSOU", {
									USER: member2,
								}),
							})
						} else {
							await changeDB(member.user.id, "falcoins", -bet)
							await changeDB(member2.user.id, "falcoins", -bet)
							const row = new ActionRowBuilder()
							const row2 = new ActionRowBuilder()
							const row3 = new ActionRowBuilder()

							for (var i = 1; i < 10; i++) {
								let button = new ButtonBuilder()
									.setCustomId(String(i))
									.setLabel("\u200b")
									.setStyle("Secondary")
								if (i < 4) {
									row.addComponents(button)
								} else if (i < 7) {
									row2.addComponents(button)
								} else {
									row3.addComponents(button)
								}
							}

							//randomizing who starts
							let random = randint(0, 1)
							if (random == 0) {
								var first_player = member
								var second_player = member2
							} else {
								var first_player = member2
								var second_player = member
							}

							answer2 = await collected.first().reply({
								content: `:older_woman: \`${member.displayName}\` **VS**  \`${
									member2.displayName
								}\` \n\n${instance.getMessage(guild, "VELHA_MOVIMENTO", {
									USER: first_player.displayName,
								})}`,
								components: [row, row2, row3],
								fetchReply: true,
							})

							const filter2 = (btInt) => {
								if (
									btInt.user.id === first_player.user.id &&
									board.currentMark() === "X" &&
									!btInt.user.bot &&
									!instance._banned.includes(btInt.user.id)
								) {
									return true
								} else if (
									btInt.user.id === second_player.user.id &&
									board.currentMark() === "O" &&
									!btInt.user.bot &&
									!instance._banned.includes(btInt.user.id)
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
										? row.components[0].setStyle("Primary")
										: row.components[0].setStyle("Danger")
									row.components[0].setDisabled(true)
									board = board.makeMove(1, board.currentMark())
								} else if (i.customId === "2") {
									row.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row.components[1].setStyle("Primary")
										: row.components[1].setStyle("Danger")
									row.components[1].setDisabled(true)
									board = board.makeMove(2, board.currentMark())
								} else if (i.customId === "3") {
									row.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row.components[2].setStyle("Primary")
										: row.components[2].setStyle("Danger")
									row.components[2].setDisabled(true)
									board = board.makeMove(3, board.currentMark())
								} else if (i.customId === "4") {
									row2.components[0].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[0].setStyle("Primary")
										: row2.components[0].setStyle("Danger")
									row2.components[0].setDisabled(true)
									board = board.makeMove(4, board.currentMark())
								} else if (i.customId === "5") {
									row2.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[1].setStyle("Primary")
										: row2.components[1].setStyle("Danger")
									row2.components[1].setDisabled(true)
									board = board.makeMove(5, board.currentMark())
								} else if (i.customId === "6") {
									row2.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row2.components[2].setStyle("Primary")
										: row2.components[2].setStyle("Danger")
									row2.components[2].setDisabled(true)
									board = board.makeMove(6, board.currentMark())
								} else if (i.customId === "7") {
									row3.components[0].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[0].setStyle("Primary")
										: row3.components[0].setStyle("Danger")
									row3.components[0].setDisabled(true)
									board = board.makeMove(7, board.currentMark())
								} else if (i.customId === "8") {
									row3.components[1].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[1].setStyle("Primary")
										: row3.components[1].setStyle("Danger")
									row3.components[1].setDisabled(true)
									board = board.makeMove(8, board.currentMark())
								} else if (i.customId === "9") {
									row3.components[2].setLabel(board.currentMark())
									i.user.id === member.id
										? row3.components[2].setStyle("Primary")
										: row3.components[2].setStyle("Danger")
									row3.components[2].setDisabled(true)
									board = board.makeMove(9, board.currentMark())
								}

								await i.update({
									content: `:older_woman: \`${member.displayName}\` **VS**  \`${
										member2.displayName
									}\` \n\n${instance.getMessage(guild, "VELHA_MOVIMENTO", {
										USER:
											board.currentMark() === "X"
												? first_player.displayName
												: second_player.displayName,
									})}`,
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
										}\` \n\n**${instance.getMessage(guild, "GANHOU", {
											WINNER:
												board.winningPlayer() === "X"
													? first_player.displayName
													: second_player.displayName,
											FALCOINS: await format(bet * 2),
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
										}\` \n\n${instance.getMessage(guild, "VELHA_EMPATOU")}`,
									})
								}
							})
						}
					})
				} else {
					await interaction.editReply({
						content: instance.getMessage(guild, "INSUFICIENTE_CONTAS"),
					})
				}
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "NAO_JOGAR_SOZINHO"),
				})
			}
		} catch (error) {
			console.error(`velha: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				components: [],
			})
		}
	},
}
