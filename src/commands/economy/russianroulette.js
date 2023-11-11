const { SlashCommandBuilder } = require('discord.js');
const { specialArg, randint, format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('russianroulette')
		.setNameLocalizations({
			'pt-BR': 'roletarussa',
			'es-ES': 'ruletarusa',
		})
		.setDescription('Play with other users, last to survive wins all the falcoins')
		.setDescriptionLocalizations({
			'pt-BR': 'Jogue roleta russa com outros usuários, o sovrevivente leva os falcoins',
			'es-ES': 'Juega con otros usuarios, el último en sobrevivir se lleva todos los falcoins',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to play with (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalizations({
					'pt-BR': 'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'la cantidad de falcoins para apostar (soporta "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, user, instance, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
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
			}
			if (player.falcoins >= bet) {
				var pot = bet;
				const embed = instance
					.createEmbed('#0099ff')
					.setDescription(
						instance.getMessage(interaction, 'RUSSIANROULETTE_DESCRIPTION', {
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
				var names = [user];
				mensagens = instance.getMessage(interaction, 'RUSROL');

				const filter = async (btInt) => {
					return instance.defaultFilter(btInt);
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60,
				});

				collector.on('collect', async (i) => {
					const collectorUser = await database.player.findOne(i.user.id);
					if (i.customId === 'skip' && i.user.id === user.id && users.length > 1) {
						collector.stop();
					} else if (i.customId === 'accept' && collectorUser.falcoins >= bet && !users.includes(i.user)) {
						collectorUser.falcoins -= bet;
						users.push(i.user);
						names.push(i.user);
						pot += bet;
						embed.setDescription(
							instance.getMessage(interaction, 'RUSSIANROULETTE_DESCRIPTION', {
								USER: user,
								BET: format(pot),
							})
						);
						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'PLAYERS'),
							value: `${names.join('\n')}`,
							inline: false,
						};
					}

					await i.update({
						embeds: [embed],
					});
					collectorUser.save();
				});

				collector.on('end', async () => {
					while (users.length > 1) {
						var luck = randint(0, users.length - 1);
						var eliminated = users[luck];
						names.splice(
							names.findIndex((user) => user === eliminated),
							1,
							`~~${eliminated}~~ :skull:`
						);
						users.splice(luck, 1);
						embed.setDescription(
							instance.getMessage(interaction, 'RUSSIANROULETTE_DESCRIPTION2', {
								BET: format(pot),
							}) + `\n${eliminated} ${mensagens[randint(0, mensagens.length - 1)]}`
						);

						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'PLAYERS'),
							value: `${names.join('\n')}`,
							inline: false,
						};

						await instance.editReply(interaction, {
							embeds: [embed],
							components: [],
						});
						await new Promise((resolve) => setTimeout(resolve, 5000));
					}
					var winner = users[0];
					const winnerFile = await database.player.findOne(winner.id);
					winnerFile.falcoins += pot;
					if (users.length > 1) winnerFile.vitorias++;
					embed.setDescription(
						instance.getMessage(interaction, 'RUSSIANROULETTE_DESCRIPTION3', {
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
			} else if (bet <= 0) {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: bet,
					}),
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
			}
		} catch (error) {
			console.error(`russianroulette: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
