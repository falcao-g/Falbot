const { SlashCommandBuilder } = require('discord.js');
const { specialArg, readFile, format, randint, changeDB, buttons } = require('../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fight')
		.setNameLocalization('pt-BR', 'luta')
		.setDescription('Challenge someone to a fight, whoever wins the fight gets all falcoins bet')
		.setDescriptionLocalization(
			'pt-BR',
			'Desafie outro usuário para uma luta, quem ganhar leva todos os falcoins apostados'
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalization('pt-BR', 'usuário')
				.setDescription('the user to challenge')
				.setDescriptionLocalization('pt-BR', 'quem você quer desafiar')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, member, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			var member2 = await guild.members.fetch(interaction.options.getUser('user').id);

			if (member2.user === user) {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'NAO_JOGAR_SOZINHO'),
				});
				return;
			}

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
			if ((await readFile(user.id, 'falcoins')) >= bet && (await readFile(member2.user.id, 'falcoins')) >= bet) {
				var answer = await interaction.editReply({
					content: instance.getMessage(interaction, 'LUTA_CONVITE', {
						USER: member,
						USER2: member2,
						FALCOINS: format(bet),
					}),
					components: [buttons(['accept', 'refuse'])],
					fetchReply: true,
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member2.user.id;
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					max: 1,
					time: 1000 * 300,
				});

				collector.on('end', async (collected) => {
					if (collected.size === 0) {
						interaction.followUp({
							content: instance.getMessage(interaction, 'LUTA_CANCELADO_DEMOROU', {
								USER: member2,
							}),
						});
					} else if (collected.first().customId === 'refuse') {
						interaction.followUp({
							content: instance.getMessage(interaction, 'LUTA_CANCELADO_RECUSOU', {
								USER: member2,
							}),
						});
					} else {
						await changeDB(user.id, 'falcoins', -bet);
						await changeDB(member2.id, 'falcoins', -bet);
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
							name: member2.displayName,
							stunned: false,
							mention: member2,
							id: member2.id,
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
									field.value += instance.getMessage(interaction, 'NOCAUTEADO');
								} else if (enemy.escudo === true && !['self', 'escudo', 'cura'].includes(attack)) {
									field.value += instance.getMessage(interaction, 'TENTOU_ATACAR');
								} else if (attack === 'instantâneo') {
									enemy.hp -= luck;
									field.value += instance.getMessage(interaction, 'ATAQUE', {
										VALUE: luck,
									});
								} else if (attack === 'stun') {
									enemy.hp -= luck;
									enemy.stunned = true;
									field.value += instance.getMessage(interaction, 'ATAQUE_NOCAUTE', {
										VALUE: luck,
									});
								} else if (attack === 'roubo de vida') {
									enemy.hp -= luck;
									player.hp += luck;
									field.value += instance.getMessage(interaction, 'ROUBO_VIDA', {
										VALUE: luck,
									});
								} else if (attack === 'cura') {
									player.hp += luck;
									field.value += instance.getMessage(interaction, 'CURA', {
										VALUE: luck,
									});
								} else if (attack === 'self') {
									player.hp -= luck;
									field.value += instance.getMessage(interaction, 'SELF', {
										VALUE: luck,
									});
								} else if (attack === 'escudo') {
									player.escudo = true;
									field.value += instance.getMessage(interaction, 'SE_PROTEGE');
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

						await changeDB(winner.id, 'falcoins', bet * 2);
						await changeDB(winner.id, 'vitorias');

						const embed2 = instance.createEmbed(3066993).addFields(
							{
								name: `${winner.name}${instance.getMessage(interaction, 'GANHO')}`,
								value: instance.getMessage(interaction, 'LUTA_DERROTOU', {
									USER: loser.mention,
								}),
							},
							{
								name: instance.getMessage(interaction, 'SALDO_ATUAL'),
								value: `${await readFile(winner.id, 'falcoins', true)} falcoins`,
							}
						);

						await interaction.channel.send({
							embeds: [embed2],
						});
					}
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'INSUFICIENTE_CONTAS'),
				});
			}
		} catch (error) {
			console.error(`fight: ${error}`);
			interaction.channel.send({
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
