const { SlashCommandBuilder } = require('discord.js');
const { specialArg, format, randint, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fight')
		.setNameLocalizations({
			'pt-BR': 'luta',
			'es-ES': 'lucha',
		})
		.setDescription('Challenge someone to a fight, whoever wins the fight gets all falcoins bet')
		.setDescriptionLocalizations({
			'pt-BR': 'Desafie outro usuário para uma luta, quem ganhar leva todos os falcoins apostados',
			'es-ES': 'Desafía a alguien a una pelea, quien gane la pelea se lleva todos los falcoins apostados',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('the user to challenge')
				.setDescriptionLocalizations({
					'pt-BR': 'o usuário para desafiar',
					'es-ES': 'el usuario para desafiar',
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalizations({
					'pt-BR': 'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'la cantidad de falcoins para apostar (soporta "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, member, instance, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			var challenged = await guild.members.fetch(interaction.options.getUser('user').id);
			const author = await database.player.findOne(user.id);
			const challengedFile = await database.player.findOne(challenged.id);

			if (challenged.user === user) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'DONT_PLAY_ALONE'),
				});
				return;
			}

			try {
				var bet = await specialArg(falcoins, author.falcoins);
			} catch {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: falcoins,
					}),
				});
				return;
			}
			if (author.falcoins >= bet && challengedFile.falcoins >= bet) {
				var answer = await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'FIGHT_CHALLENGE', {
						USER: member,
						USER2: challenged,
						FALCOINS: format(bet),
					}),
					components: [buttons(['accept', 'refuse'])],
					fetchReply: true,
				});

				const filter = (btInt) => {
					return (
						instance.defaultFilter(btInt) &&
						(btInt.user.id === challenged.user.id || (btInt.user.id === user.id && btInt.customId === 'refuse'))
					);
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					max: 1,
					time: 1000 * 300,
				});

				collector.on('end', async (collected) => {
					if (collected.size === 0) {
						interaction.followUp({
							content: instance.getMessage(interaction, 'FIGHT_TOO_LONG', {
								USER: challenged,
							}),
						});
					} else if (collected.first().customId === 'refuse' && collected.first().user.id === user.id) {
						interaction.followUp({
							content: instance.getMessage(interaction, 'FIGHT_DECLINED', {
								USER: member,
							}),
						});
					} else if (collected.first().customId === 'refuse') {
						interaction.followUp({
							content: instance.getMessage(interaction, 'FIGHT_DECLINED', {
								USER: challenged,
							}),
						});
					} else {
						author.falcoins -= bet;
						challengedFile.falcoins -= bet;
						const attacks = ['instantâneo', 'stun', 'roubo de vida', 'cura', 'self', 'escudo'];
						const player_1 = {
							hp: 100,
							name: member.displayName,
							stunned: false,
							mention: user,
							id: user.id,
							escudo: false,
						};
						const player_2 = {
							hp: 100,
							name: challenged.displayName,
							stunned: false,
							mention: challenged,
							id: challenged.id,
							escudo: false,
						};
						const luck = Math.round(Math.random());
						const order = luck === 0 ? [player_1, player_2] : [player_2, player_1];

						first = true;
						while (order[0]['hp'] > 0 && order[1]['hp'] > 0) {
							for (const [i, player] of order.entries()) {
								const enemy = i === 0 ? order[1] : order[0];
								var embed = instance.createEmbed(3447003);
								if (i !== 0) embed.setColor(15105570);

								if (player.hp <= 0 || enemy.hp <= 0) {
									break;
								}

								player.escudo = false;

								const attack = attacks[randint(0, attacks.length - 1)];
								const luck = randint(1, 50);

								field = {
									name: instance.getMessage(interaction, 'TURN', {
										USER: player.name,
									}),
									value: `${player.mention} `,
								};

								if (player.stunned === true) {
									player.stunned = false;
									field.value += instance.getMessage(interaction, 'UNCONSCIOUS');
								} else if (enemy.escudo === true && !['self', 'escudo', 'cura'].includes(attack)) {
									field.value += instance.getMessage(interaction, 'FAILED');
								} else if (attack === 'instantâneo') {
									enemy.hp -= luck;
									field.value += instance.getMessage(interaction, 'ATTACK', {
										VALUE: luck,
									});
								} else if (attack === 'stun') {
									enemy.hp -= luck;
									enemy.stunned = true;
									field.value += instance.getMessage(interaction, 'STUN', {
										VALUE: luck,
									});
								} else if (attack === 'roubo de vida') {
									enemy.hp -= luck;
									player.hp += luck;
									field.value += instance.getMessage(interaction, 'LIFE_STEAL', {
										VALUE: luck,
									});
								} else if (attack === 'cura') {
									player.hp += luck;
									field.value += instance.getMessage(interaction, 'HEAL', {
										VALUE: luck,
									});
								} else if (attack === 'self') {
									player.hp -= luck;
									field.value += instance.getMessage(interaction, 'SELF', {
										VALUE: luck,
									});
								} else if (attack === 'escudo') {
									player.escudo = true;
									field.value += instance.getMessage(interaction, 'PROTECTED');
								}

								embed.addFields(field);

								player.hp = Math.min(player.hp, 100);

								embed.addFields({
									name: 'HP',
									value: `${order[0]['mention']}: ${order[0]['hp']} hp\n${order[1]['mention']}: ${order[1]['hp']} hp`,
								});

								if (first) {
									await collected.first().reply({
										embeds: [embed],
										components: [],
									});
									first = false;
								} else {
									await interaction.channel.send({
										embeds: [embed],
									});
								}

								await new Promise((resolve) => setTimeout(resolve, 2500));
							}
						}

						const winner = order[0].hp <= 0 ? order[1] : order[0];
						const loser = order[0].hp <= 0 ? order[0] : order[1];

						const winnerFile = await database.player.findOne(winner.id);
						winnerFile.falcoins += bet * 2;
						winnerFile.wins++;

						const embed2 = instance.createEmbed(3066993).addFields(
							{
								name: `${winner.name}${instance.getMessage(interaction, 'GAINED')}`,
								value: instance.getMessage(interaction, 'FIGHT_DEFEATED', {
									USER: loser.mention,
								}),
							},
							{
								name: instance.getMessage(interaction, 'BALANCE'),
								value: `${format(winnerFile.falcoins)} falcoins`,
							}
						);

						await interaction.channel
							.send({
								embeds: [embed2],
							})
							.catch((err) => console.error(err));
					}
				});
			} else {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'INSUFFICIENT_ACCOUNTS'),
				});
			}
			author.save();
			challengedFile.save();
		} catch (error) {
			console.error(`fight: ${error}`);
			interaction.channel
				.send({
					content: instance.getMessage(interaction, 'EXCEPTION'),
				})
				.catch((err) => console.error(err));
		}
	},
};
