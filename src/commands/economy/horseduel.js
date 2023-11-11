const { SlashCommandBuilder } = require('discord.js');
const { specialArg, randint, format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('horseduel')
		.setNameLocalizations({
			'pt-BR': 'corrida',
			'es-ES': 'carrera',
		})
		.setDescription('Starts a horse race that other users can join')
		.setDescriptionLocalizations({
			'pt-BR': 'Inicia uma corrida de cavalos que outros usuários podem participar',
			'es-ES': 'Inicia una carrera de caballos que otros usuarios pueden participar',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalizations({
					'pt-BR': 'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'la cantidad de falcoins para apostar (soporta "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, user, instance, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			const player = await database.player.findOne(user.id);
			try {
				var bet = await specialArg(falcoins, player.falcoins);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: falcoins,
					}),
				});
				return;
			}

			if (player.falcoins >= bet) {
				var pot = bet;
				const embed = instance
					.createEmbed('#0099ff')
					.setDescription(
						instance.getMessage(interaction, 'HORSERACE_DESCRIPTION', {
							USER: user,
							BET: format(pot),
						})
					)
					.addFields({
						name: instance.getMessage(interaction, 'PLAYERS'),
						value: `${user}`,
						inline: false,
					});

				var answer = await instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['accept', 'skip'])],
					fetchReply: true,
				});

				player.falcoins -= bet;

				var users = [user];
				var path = ['- - - - -'];

				const filter = async (btInt) => {
					return instance.defaultFilter(btInt);
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60,
				});

				collector.on('collect', async (i) => {
					var collectorUser = await database.player.findOne(i.user.id);
					if (i.customId === 'skip' && i.user.id === user.id && users.length > 1) {
						collector.stop();
					} else if (i.customId === 'accept' && collectorUser.falcoins >= bet && !users.includes(i.user)) {
						collectorUser.falcoins -= bet;
						users.push(i.user);
						path.push('- - - - -');
						pot += bet;
						embed.setDescription(
							instance.getMessage(interaction, 'HORSERACE_DESCRIPTION', {
								USER: user,
								BET: format(pot),
							})
						);
						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'PLAYERS'),
							value: `${users.join('\n')}`,
							inline: false,
						};
					}

					await i.update({
						embeds: [embed],
					});
					collectorUser.save();
				});

				collector.on('end', async () => {
					while (true) {
						var luck = randint(0, users.length - 1);
						path[luck] = path[luck].slice(0, -2);

						var frase = '';
						for (let i = 0; i < path.length; i++) {
							frase += `${users[i]}\n:checkered_flag: ${path[i]}:horse_racing:\n\n`;
						}

						embed.setDescription(
							instance.getMessage(interaction, 'HORSERACE_DESCRIPTION2', {
								BET: format(pot),
							})
						);

						embed.data.fields[0] = {
							name: '\u200b',
							value: `${frase}`,
							inline: false,
						};

						await instance.editReply(interaction, {
							embeds: [embed],
							components: [],
						});

						if (path[luck] === '') {
							var winner = users[luck];
							break;
						}

						await new Promise((resolve) => setTimeout(resolve, 250));
					}

					const winnerFile = await database.player.findOne(winner.id);
					winnerFile.falcoins += pot;
					if (users.length > 1) winnerFile.vitorias++;
					embed.setDescription(
						instance.getMessage(interaction, 'HORSERACE_DESCRIPTION3', {
							BET: format(pot),
							USER: winner,
							SALDO: format(winnerFile.falcoins),
						})
					);

					await instance.editReply(interaction, {
						embeds: [embed],
						components: [],
					});
					player.save();
					winnerFile.save();
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
			}
		} catch (error) {
			console.error(`horseduel: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
