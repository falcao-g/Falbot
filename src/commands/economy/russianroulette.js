const { SlashCommandBuilder } = require('discord.js');
const { specialArg, readFile, changeDB, randint, format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('russianroulette')
		.setNameLocalization('pt-BR', 'roletarussa')
		.setDescription('Play with other users, last to survive wins all the falcoins')
		.setDescriptionLocalization('pt-BR', 'Jogue roleta russa com outros usuários, o sovrevivente leva os falcoins')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to play with (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ interaction, user, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const falcoins = interaction.options.getString('falcoins');
			try {
				var bet = await specialArg(falcoins, user.id, 'falcoins');
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
			}
			if ((await readFile(user.id, 'falcoins')) >= bet) {
				var pot = bet;
				const embed = instance
					.createEmbed('#0099ff')
					.setDescription(
						instance.getMessage(interaction, 'ROLETARUSSA_DESCRIPTION', {
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
					if (i.customId === 'skip' && i.user.id === user.id && users.length > 1) {
						collector.stop();
					} else if (
						i.customId === 'accept' &&
						(await readFile(i.user.id, 'falcoins')) >= bet &&
						!users.includes(i.user)
					) {
						await changeDB(i.user.id, 'falcoins', -bet);
						users.push(i.user);
						names.push(i.user);
						pot += bet;
						embed.setDescription(
							instance.getMessage(interaction, 'ROLETARUSSA_DESCRIPTION', {
								USER: user,
								BET: format(pot),
							})
						);
						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'JOGADORES'),
							value: `${names.join('\n')}`,
							inline: false,
						};
					}

					await i.update({
						embeds: [embed],
					});
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
							instance.getMessage(interaction, 'ROLETARUSSA_DESCRIPTION2', {
								BET: format(pot),
							}) + `\n${eliminated} ${mensagens[randint(0, mensagens.length - 1)]}`
						);

						embed.data.fields[0] = {
							name: instance.getMessage(interaction, 'JOGADORES'),
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
					await changeDB(winner.id, 'falcoins', pot);
					if (users.length > 1) await changeDB(winner.id, 'vitorias');
					embed.setDescription(
						instance.getMessage(interaction, 'ROLETARUSSA_DESCRIPTION3', {
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
			} else if (bet <= 0) {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: bet,
					}),
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
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
