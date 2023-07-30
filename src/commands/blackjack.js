const { specialArg, readFile, changeDB, format } = require('../utils/functions.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Blackjack = require('simply-blackjack');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjack')
		.setNameLocalization('pt-BR', 'vinteum')
		.setDescription('Play a game of blackjack')
		.setDescriptionLocalization('pt-BR', 'Jogue um jogo de 21')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ member, interaction, instance, user }) => {
		await interaction.deferReply();
		try {
			const falcoins = interaction.options.getString('falcoins');
			try {
				var bet = await specialArg(falcoins, user.id, 'falcoins');
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
				return;
			}
			if ((await readFile(user.id, 'falcoins')) >= bet) {
				await changeDB(user.id, 'falcoins', -bet);

				const Game = new Blackjack({
					decks: 2,
					payouts: {
						blackjack: 1,
						default: 1,
					},
				});
				Game.bet(bet);
				Game.start();

				const enum_cards = {
					A: instance.emojiList['A_'],
					2: instance.emojiList['2_'],
					3: instance.emojiList['3_'],
					4: instance.emojiList['4_'],
					5: instance.emojiList['5_'],
					6: instance.emojiList['6_'],
					7: instance.emojiList['7_'],
					8: instance.emojiList['8_'],
					9: instance.emojiList['9_'],
					10: instance.emojiList['10'],
					J: instance.emojiList['J_'],
					Q: instance.emojiList['Q_'],
					K: instance.emojiList['K_'],
					hidden: instance.emojiList['escondida'],
				};

				var player_cards = [];
				var dealer_cards = [];

				Game.player.forEach((element) => {
					player_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
				});

				Game.table.dealer.cards.forEach((element) => {
					dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
				});
				dealer_cards.push(enum_cards['hidden']);

				const embed = instance.createEmbed(member.displayColor).addFields(
					{
						name: 'BlackJack',
						value: instance.getMessage(interaction, 'BLACKJACK_TITLE', {
							BET: format(bet),
						}),
						inline: false,
					},
					{
						name: instance.getMessage(interaction, 'PLAYER_HAND', {
							CARDS: player_cards.join(' '),
						}),
						value: instance.getMessage(interaction, 'VALUE', {
							VALUE: Game.table.player.total,
						}),
						inline: true,
					},
					{
						name: instance.getMessage(interaction, 'DEALER_HAND', {
							CARDS: dealer_cards.join(' '),
						}),
						value: instance.getMessage(interaction, 'VALUE', {
							VALUE: Game.table.dealer.total,
						}),
						inline: true,
					}
				);

				const row = new ActionRowBuilder().addComponents(
					(hit = new ButtonBuilder()
						.setCustomId('hit')
						.setLabel(instance.getMessage(interaction, 'HIT'))
						.setStyle('Secondary')),
					(stand = new ButtonBuilder()
						.setCustomId('stand')
						.setLabel(instance.getMessage(interaction, 'STAND'))
						.setStyle('Secondary')),
					(double = new ButtonBuilder()
						.setCustomId('double')
						.setLabel(instance.getMessage(interaction, 'DOUBLE'))
						.setStyle('Secondary'))
				);

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === user.id;
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60 * 30,
				});

				Game.on('end', async (results) => {
					collector.stop();
					double.setDisabled(true);
					hit.setDisabled(true);
					stand.setDisabled(true);

					var player_cards = [];
					var dealer_cards = [];

					results.player.cards.forEach((element) => {
						player_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
					});

					results.dealer.cards.forEach((element) => {
						dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
					});

					embed.data.fields[1] = {
						name: instance.getMessage(interaction, 'PLAYER_HAND', {
							CARDS: player_cards.join(' '),
						}),
						value: instance.getMessage(interaction, 'VALUE', {
							VALUE: results.player.total,
						}),
						inline: true,
					};
					embed.data.fields[2] = {
						name: instance.getMessage(interaction, 'DEALER_HAND', {
							CARDS: dealer_cards.join(' '),
						}),
						value: instance.getMessage(interaction, 'VALUE', {
							VALUE: results.dealer.total,
						}),
						inline: true,
					};

					if (results.state === 'draw') {
						embed.data.fields[0].value = instance.getMessage(interaction, 'BLACKJACK_DRAW', {
							FALCOINS: format(results.bet),
						});
						embed.setColor(9807270);
						await changeDB(user.id, 'falcoins', results.bet);
					} else if (results.state === 'player_blackjack') {
						embed.data.fields[0].value = instance.getMessage(interaction, 'PLAYER_BLACKJACK', {
							FALCOINS: format(results.winnings),
						});
						embed.setColor(15844367);
						await changeDB(user.id, 'falcoins', results.bet + results.winnings);
					} else if (results.state === 'player_win') {
						if (results.dealer.total > 21) {
							embed.data.fields[0].value = instance.getMessage(interaction, 'DEALER_BUST', {
								FALCOINS: format(results.winnings / 2),
							});
						} else {
							embed.data.fields[0].value = instance.getMessage(interaction, 'YOU_WON', {
								FALCOINS: format(Math.floor(results.winnings / 2)),
							});
						}
						embed.setColor(3066993);
						await changeDB(user.id, 'falcoins', results.bet + Math.floor(results.winnings / 2));
					} else if (results.state === 'dealer_win') {
						if (results.player.total > 21) {
							embed.data.fields[0].value = instance.getMessage(interaction, 'PLAYER_BUST', {
								FALCOINS: format(results.losses),
							});
						} else {
							embed.data.fields[0].value = instance.getMessage(interaction, 'YOU_LOST', {
								FALCOINS: format(results.losses),
							});
						}
						embed.setColor(15158332);
					} else {
						embed.data.fields[0].value = instance.getMessage(interaction, 'DEALER_BLACKJACK', {
							FALCOINS: format(results.losses),
						});
						embed.setColor(10038562);
					}

					embed.data.fields[0].value += `\n${instance.getMessage(interaction, 'SALDO_ATUAL')}: ${await readFile(
						user.id,
						'falcoins',
						true
					)} falcoins`;

					await interaction.editReply({
						embeds: [embed],
						components: [row],
					});
				});

				if (Game.table.player.total >= 21) {
					Game.stand();
				}

				collector.on('collect', async (i) => {
					if (i.customId === 'hit') {
						Game.hit();

						double.setDisabled(true);

						if (Game.table.player.total >= 21) {
							Game.stand();
							i.deferUpdate();
						} else {
							var player_cards = [];
							var dealer_cards = [];

							Game.player.forEach((element) => {
								player_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
							});

							Game.table.dealer.cards.forEach((element) => {
								dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()]);
							});
							dealer_cards.push(enum_cards['hidden']);

							embed.data.fields[1] = {
								name: instance.getMessage(interaction, 'PLAYER_HAND', {
									CARDS: player_cards.join(' '),
								}),
								value: instance.getMessage(interaction, 'VALUE', {
									VALUE: Game.table.player.total,
								}),
								inline: true,
							};
							embed.data.fields[2] = {
								name: instance.getMessage(interaction, 'DEALER_HAND', {
									CARDS: dealer_cards.join(' '),
								}),
								value: instance.getMessage(interaction, 'VALUE', {
									VALUE: Game.table.dealer.total,
								}),
								inline: true,
							};

							await i.update({
								embeds: [embed],
								components: [row],
							});
						}
					} else if (i.customId === 'stand') {
						Game.stand();
						i.deferUpdate();
					} else {
						if ((await readFile(user.id, 'falcoins')) >= bet) {
							await changeDB(user.id, 'falcoins', -bet);
							Game.bet(bet * 2);
							Game.hit();
							Game.stand();
							i.deferUpdate();
						} else {
							i.reply({
								content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
								ephemeral: true,
							});
						}
					}
				});

				collector.on('end', () => {
					if (collector.endReason === 'time') {
						Game.stand();
					}
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
				});
			}
		} catch (error) {
			console.error(`blackjack: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
