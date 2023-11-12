const { msToTime, format, specialArg } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lottery')
		.setNameLocalizations({ 'pt-BR': 'loteria', 'es-ES': 'lotería' })
		.setDescription('Lottery')
		.setDescriptionLocalizations({ 'pt-BR': 'Loteria', 'es-ES': 'lotería' })
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View lottery info')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja as informações da loteria',
					'es-ES': 'Veja las informaciones de la lotería',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('buy')
				.setNameLocalizations({
					'pt-BR': 'comprar',
					'es-ES': 'comprar',
				})
				.setDescription('Buy lottery tickets')
				.setDescriptionLocalizations({
					'pt-BR': 'Compre bilhetes de loteria',
					'es-ES': 'Compre billetes de lotería',
				})
				.addStringOption((option) =>
					option
						.setName('amount')
						.setNameLocalizations({
							'pt-BR': 'quantidade',
							'es-ES': 'cantidad',
						})
						.setDescription('amount of lottery tickets to buy')
						.setDescriptionLocalizations({
							'pt-BR': 'quantidade de bilhetes para comprar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M)',
							'es-ES': 'cantidad de billetes para comprar (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('history')
				.setNameLocalizations({
					'pt-BR': 'histórico',
					'es-ES': 'histórico',
				})
				.setDescription('See the last 10 winners of the lottery')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja os 10 últimos gahnadores da loteria',
					'es-ES': 'Veja los 10 últimos ganadores de la lotería',
				})
		),
	execute: async ({ user, interaction, instance, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const lotto = await instance.lottoSchema.findById('semanal');
			const type = interaction.options.getSubcommand();
			const player = await database.player.findOne(user.id);
			if (type === 'buy') {
				try {
					var amount = specialArg(interaction.options.getString('amount'), parseInt(player.falcoins / 500));
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: amount,
						}),
					});
					return;
				}

				if (player.falcoins > amount * 500) {
					var embed = instance.createEmbed(15844367).addFields({
						name: `:tickets: ${format(amount)} ` + instance.getMessage(interaction, 'PURCHASED'),
						value: instance.getMessage(interaction, 'LOTTERY_COST', {
							COST: format(amount * 500),
						}),
					});

					player.falcoins -= amount * 500;
					player.tickets += amount;

					await instance.editReply(interaction, {
						embeds: [embed],
					});
				} else {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
					});
				}
			} else if (type === 'view') {
				var embed = instance.createEmbed(15844367).addFields(
					{
						name: instance.getMessage(interaction, 'LOTTERY'),
						value: instance.getMessage(interaction, 'LOTTERY_POOL', {
							PRIZE: format(lotto.prize),
						}),
						inline: false,
					},
					{
						name: 'Info',
						value: instance.getMessage(interaction, 'LOTTERY_INFO', {
							TIME: msToTime(lotto.nextDraw - Date.now()),
						}),
						inline: false,
					}
				);

				if (player.tickets > 0) {
					embed.data.fields[0].value += instance.getMessage(interaction, 'LOTTERY_TICKETS', {
						TICKETS: format(player.tickets),
					});
				}

				await instance.editReply(interaction, {
					embeds: [embed],
				});
			} else {
				history = '';
				for (winner of lotto.history) {
					if (winner.winner != undefined) {
						history += instance.getMessage(interaction, 'HISTORY', {
							FALCOINS: format(winner.prize),
							USER: winner.winner,
							TICKETS: winner.userTickets,
							TOTAL: winner.totalTickets,
						});
					} else {
						history += instance.getMessage(interaction, 'HISTORY_NO_WINNER', {
							FALCOINS: format(winner.prize),
						});
					}
				}

				var embed = instance.createEmbed(15844367).addFields({
					name: instance.getMessage(interaction, 'LOTTERY_WINNERS'),
					value: history,
				});

				await instance.editReply(interaction, {
					embeds: [embed],
				});
			}
			player.save();
		} catch (err) {
			console.error(`lottery: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
