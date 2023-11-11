const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js');
const Board = require('tictactoe-board');
const { specialArg, format, randint, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tictactoe')
		.setNameLocalizations({
			'pt-BR': 'velha',
			'es-ES': 'tresenraya',
		})
		.setDescription('Challenge someone to a game of tic tac toe')
		.setDescriptionLocalizations({
			'pt-BR': 'Desafie alguém para um jogo da velha',
			'es-ES': 'Desafía a alguien a un juego de tres en raya',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('user to challenge')
				.setDescriptionLocalizations({
					'pt-BR': 'usuário para desafiar',
					'es-ES': 'usuario para desafiar',
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription(
					'amount of falcoins to bet in the game (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalizations({
					'pt-BR': 'quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'cantidad de falcoins para apostar (soporta "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, user, member, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			var board = new Board.default();
			const challenged = await guild.members.fetch(interaction.options.getUser('user').id);
			const falcoins = interaction.options.getString('falcoins');
			const author = await database.player.findOne(user.id);
			const challengedFile = await database.player.findOne(challenged.user.id);
			if (challenged != member) {
				try {
					var bet = await specialArg(falcoins, author.falcoins);
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: falcoins,
						}),
					});
					return;
				}
				if (author.falcoins >= bet && challengedFile.falcoins >= bet) {
					var answer = await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'TICTACTOE_CHALLENGE', {
							USER: member,
							USER2: challenged,
							FALCOINS: format(bet),
						}),
						components: [buttons(['accept', 'refuse'])],
						fetchReply: true,
					});

					const filter = (btInt) => {
						return instance.defaultFilter(btInt) && btInt.user.id === challenged.user.id;
					};

					const collector = answer.createMessageComponentCollector({
						filter,
						max: 1,
						time: 1000 * 300,
					});

					collector.on('end', async (collected) => {
						if (collected.size === 0) {
							await interaction.followUp({
								content: instance.getMessage(interaction, 'TICTACTOE_TOO_LONG', {
									USER: challenged,
								}),
							});
						} else if (collected.first().customId === 'refuse') {
							await interaction.followUp({
								content: instance.getMessage(interaction, 'TICTACTOE_DECLINED', {
									USER: challenged,
								}),
							});
						} else {
							author.falcoins -= bet;
							challengedFile.falcoins -= bet;
							author.save();
							challengedFile.save();
							const row = new ActionRowBuilder();
							const row2 = new ActionRowBuilder();
							const row3 = new ActionRowBuilder();

							for (var i = 1; i < 10; i++) {
								const button = new ButtonBuilder().setCustomId(String(i)).setLabel('\u200b').setStyle('Secondary');
								if (i < 4) {
									row.addComponents(button);
								} else if (i < 7) {
									row2.addComponents(button);
								} else {
									row3.addComponents(button);
								}
							}

							//randomizing who starts
							const random = randint(0, 1);
							if (random == 0) {
								var first_player = member;
								var second_player = challenged;
							} else {
								var first_player = challenged;
								var second_player = member;
							}

							answer2 = await collected.first().reply({
								content: `:older_woman: \`${member.displayName}\` **VS**  \`${
									challenged.displayName
								}\` \n\n${instance.getMessage(interaction, 'TICTACTOE_MOVE', {
									USER: first_player.displayName,
								})}`,
								components: [row, row2, row3],
								fetchReply: true,
							});

							const filter2 = (btInt) => {
								if (
									instance.defaultFilter(btInt) &&
									btInt.user.id === first_player.user.id &&
									board.currentMark() === 'X'
								) {
									return true;
								} else if (
									instance.defaultFilter(btInt) &&
									btInt.user.id === second_player.user.id &&
									board.currentMark() === 'O'
								) {
									return true;
								}
							};

							const collector2 = answer2.createMessageComponentCollector({
								filter: filter2,
								max: 9,
								time: 1000 * 60 * 60,
							});

							collector2.on('collect', async (i) => {
								if (i.customId === '1') {
									row.components[0].setLabel(board.currentMark());
									i.user.id === member.id
										? row.components[0].setStyle('Primary')
										: row.components[0].setStyle('Danger');
									row.components[0].setDisabled(true);
									board = board.makeMove(1, board.currentMark());
								} else if (i.customId === '2') {
									row.components[1].setLabel(board.currentMark());
									i.user.id === member.id
										? row.components[1].setStyle('Primary')
										: row.components[1].setStyle('Danger');
									row.components[1].setDisabled(true);
									board = board.makeMove(2, board.currentMark());
								} else if (i.customId === '3') {
									row.components[2].setLabel(board.currentMark());
									i.user.id === member.id
										? row.components[2].setStyle('Primary')
										: row.components[2].setStyle('Danger');
									row.components[2].setDisabled(true);
									board = board.makeMove(3, board.currentMark());
								} else if (i.customId === '4') {
									row2.components[0].setLabel(board.currentMark());
									i.user.id === member.id
										? row2.components[0].setStyle('Primary')
										: row2.components[0].setStyle('Danger');
									row2.components[0].setDisabled(true);
									board = board.makeMove(4, board.currentMark());
								} else if (i.customId === '5') {
									row2.components[1].setLabel(board.currentMark());
									i.user.id === member.id
										? row2.components[1].setStyle('Primary')
										: row2.components[1].setStyle('Danger');
									row2.components[1].setDisabled(true);
									board = board.makeMove(5, board.currentMark());
								} else if (i.customId === '6') {
									row2.components[2].setLabel(board.currentMark());
									i.user.id === member.id
										? row2.components[2].setStyle('Primary')
										: row2.components[2].setStyle('Danger');
									row2.components[2].setDisabled(true);
									board = board.makeMove(6, board.currentMark());
								} else if (i.customId === '7') {
									row3.components[0].setLabel(board.currentMark());
									i.user.id === member.id
										? row3.components[0].setStyle('Primary')
										: row3.components[0].setStyle('Danger');
									row3.components[0].setDisabled(true);
									board = board.makeMove(7, board.currentMark());
								} else if (i.customId === '8') {
									row3.components[1].setLabel(board.currentMark());
									i.user.id === member.id
										? row3.components[1].setStyle('Primary')
										: row3.components[1].setStyle('Danger');
									row3.components[1].setDisabled(true);
									board = board.makeMove(8, board.currentMark());
								} else if (i.customId === '9') {
									row3.components[2].setLabel(board.currentMark());
									i.user.id === member.id
										? row3.components[2].setStyle('Primary')
										: row3.components[2].setStyle('Danger');
									row3.components[2].setDisabled(true);
									board = board.makeMove(9, board.currentMark());
								}

								await i.update({
									content: `:older_woman: \`${member.displayName}\` **VS**  \`${
										challenged.displayName
									}\` \n\n${instance.getMessage(interaction, 'TICTACTOE_MOVE', {
										USER: board.currentMark() === 'X' ? first_player.displayName : second_player.displayName,
									})}`,
									components: [row, row2, row3],
								});

								if (board.isGameOver()) {
									collector2.stop();
								}
							});

							collector2.on('end', async () => {
								const firstPlayer = await database.player.findOne(first_player.user.id);
								const secondPlayer = await database.player.findOne(second_player.user.id);
								if (board.hasWinner()) {
									if (board.winningPlayer() === 'X') {
										firstPlayer.falcoins += bet * 2;
										firstPlayer.wins++;
									} else {
										secondPlayer.falcoins += bet * 2;
										secondPlayer.wins++;
									}
									await answer2.edit({
										content: `:older_woman: \`${member.displayName}\` **VS**  \`${
											challenged.displayName
										}\` \n\n**${instance.getMessage(interaction, 'WON', {
											WINNER: board.winningPlayer() === 'X' ? first_player.displayName : second_player.displayName,
											FALCOINS: await format(bet * 2),
										})}**`,
									});
								} else {
									firstPlayer.falcoins += bet;
									secondPlayer.falcoins += bet;
									await answer2.edit({
										content: `:older_woman: \`${member.displayName}\` **VS**  \`${
											challenged.displayName
										}\` \n\n${instance.getMessage(interaction, 'TICTACTOE_DRAW')}`,
									});
								}
								firstPlayer.save();
								secondPlayer.save();
							});
						}
					});
				} else {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'INSUFFICIENT_ACCOUNTS'),
					});
				}
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'DONT_PLAY_ALONE'),
				});
			}
		} catch (error) {
			console.error(`velha: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
