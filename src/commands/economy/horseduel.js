const { SlashCommandBuilder } = require('discord.js');
const { specialArg, readFile, changeDB, randint, format, buttons } = require('../../utils/functions.js');

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
	execute: async ({ interaction, user, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			try {
				var bet = await specialArg(falcoins, user.id, 'falcoins');
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
				return;
			}

			if ((await readFile(user.id, 'falcoins')) >= bet) {
				var pot = bet;
				const embed = instance
					.createEmbed('#0099ff')
					.setDescription(
						instance.getMessage(interaction, 'CAVALGADA_DESCRIPTION', {
							USER: user,
							BET: format(pot),
						})
					)
					.addFields({
						name: instance.getMessage(interaction, 'JOGADORES'),
						value: `${user}`,
						inline: false,
					});

				var answer = await instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['accept', 'skip'])],
					fetchReply: true,
				});

				await changeDB(user.id, 'falcoins', -bet);

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
					if (i.customId === 'skip' && i.user.id === user.id && users.length > 1) {
						collector.stop();
					} else if (
						i.customId === 'accept' &&
						(await readFile(i.user.id, 'falcoins')) >= bet &&
						!users.includes(i.user)
					) {
						await changeDB(i.user.id, 'falcoins', -bet);
						users.push(i.user);
						path.push('- - - - -');
						pot += bet;
						embed.setDescription(
							instance.getMessage(interaction, 'CAVALGADA_DESCRIPTION', {
								USER: user,
								BET: format(pot),
							})
						);
						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'JOGADORES'),
							value: `${users.join('\n')}`,
							inline: false,
						};
					}

					await i.update({
						embeds: [embed],
					});
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
							instance.getMessage(interaction, 'CAVALGADA_DESCRIPTION2', {
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

					await changeDB(winner.id, 'falcoins', pot);
					if (users.length > 1) await changeDB(winner.id, 'vitorias');
					embed.setDescription(
						instance.getMessage(interaction, 'CAVALGADA_DESCRIPTION3', {
							BET: format(pot),
							USER: winner,
							SALDO: await readFile(winner.id, 'falcoins', true),
						})
					);

					await instance.editReply(interaction, {
						embeds: [embed],
						components: [],
					});
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
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
