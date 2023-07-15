const { readFile, changeDB, msToTime, format } = require('../utils/functions.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lottery')
		.setNameLocalization('pt-BR', 'loteria')
		.setDescription('Lottery')
		.setDescriptionLocalization('pt-BR', 'Loteria')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalization('pt-BR', 'ver')
				.setDescription('View lottery info')
				.setDescriptionLocalization('pt-BR', 'Veja as informações da loteria')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('buy')
				.setNameLocalization('pt-BR', 'comprar')
				.setDescription('Buy lottery tickets')
				.setDescriptionLocalization('pt-BR', 'Compre bilhetes de loteria')
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalization('pt-BR', 'quantidade')
						.setDescription('amount of lottery tickets to buy')
						.setDescriptionLocalization('pt-BR', 'quantidade de bilhetes para comprar')
						.setMinValue(1)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('history')
				.setNameLocalization('pt-BR', 'histórico')
				.setDescription('See the last 10 winners of the lottery')
				.setDescriptionLocalization('pt-BR', 'Veja os 10 últimos gahnadores da loteria')
		),
	execute: async ({ user, interaction, instance }) => {
		try {
			await interaction.deferReply();
			const lotto = await instance.lottoSchema.findById('semanal');
			const type = interaction.options.getSubcommand();
			if (type === 'buy') {
				const amount = interaction.options.getInteger('amount');
				if ((await readFile(user.id, 'falcoins')) > amount * 500) {
					var embed = new EmbedBuilder()
						.setColor(15844367)
						.addFields({
							name: `:tickets: ${format(amount)} ` + instance.getMessage(interaction, 'PURCHASED'),
							value: instance.getMessage(interaction, 'LOTTERY_COST', {
								COST: format(amount * 500),
							}),
						})
						.setFooter({ text: 'by Falcão ❤️' });

					await changeDB(user.id, 'falcoins', -(amount * 500));
					await changeDB(user.id, 'tickets', amount);

					await interaction.editReply({
						embeds: [embed],
					});
				} else {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
					});
				}
			} else if (type === 'view') {
				var embed = new EmbedBuilder()
					.setColor(15844367)
					.addFields(
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
					)
					.setFooter({ text: 'by Falcão ❤️' });

				if ((await readFile(user.id, 'tickets')) > 0) {
					embed.data.fields[0].value += instance.getMessage(interaction, 'LOTTERY_TICKETS', {
						TICKETS: await readFile(user.id, 'tickets', true),
					});
				}

				await interaction.editReply({
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

				var embed = new EmbedBuilder()
					.setColor(15844367)
					.setFooter({ text: 'by Falcão ❤️' })
					.addFields({
						name: instance.getMessage(interaction, 'LOTTERY_WINNERS'),
						value: history,
					});

				await interaction.editReply({
					embeds: [embed],
				});
			}
		} catch (err) {
			console.error(`lottery: ${err}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
