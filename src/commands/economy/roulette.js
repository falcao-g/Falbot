const { randint, format } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');
const { numerize } = require('numerize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setNameLocalizations({
			'pt-BR': 'roleta',
			'es-ES': 'ruleta',
		})
		.setDescription('Bet on the roulette')
		.setDescriptionLocalizations({
			'pt-BR': 'Aposte na roleta',
			'es-ES': 'Aposte en la ruleta',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('type')
				.setNameLocalizations({
					'pt-BR': 'tipo',
					'es-ES': 'tipo',
				})
				.setDescription(
					'the columns have a 2-1 payout ratio, the green has a 35-1 (only one number) and the rest have a 1-1'
				)
				.setDescriptionLocalizations({
					'pt-BR': 'as colunas tem uma taxa de retorno de 2-1, o verde é 35-1 (só um número) e o resto 1-1',
					'es-ES': 'las columnas tienen una tasa de retorno de 2-1, el verde es 35-1 (solo un número) y el resto 1-1',
				})
				.setRequired(true)
				.addChoices(
					{
						name: 'black',
						name_localizations: { 'pt-BR': 'preto', 'es-ES': 'negro' },
						value: 'black',
					},
					{
						name: 'red',
						name_localizations: { 'pt-BR': 'vermelho', 'es-ES': 'rojo' },
						value: 'red',
					},
					{
						name: 'green',
						name_localizations: { 'pt-BR': 'verde', 'es-ES': 'verde' },
						value: 'green',
					},
					{
						name: 'high',
						name_localizations: { 'pt-BR': 'altos', 'es-ES': 'alto' },
						value: 'high',
					},
					{
						name: 'low',
						name_localizations: { 'pt-BR': 'baixos', 'es-ES': 'bajo' },
						value: 'low',
					},
					{
						name: 'even',
						name_localizations: { 'pt-BR': 'par', 'es-ES': 'par' },
						value: 'even',
					},
					{
						name: 'odd',
						name_localizations: { 'pt-BR': 'ímpar', 'es-ES': 'extraño' },
						value: 'odd',
					},
					{
						name: '1st column',
						name_localizations: { 'pt-BR': '1ª coluna', 'es-ES': '1ª columna' },
						value: 'first',
					},
					{
						name: '2nd column',
						name_localizations: { 'pt-BR': '2ª coluna', 'es-ES': '2ª columna' },
						value: 'second',
					},
					{
						name: '3rd column',
						name_localizations: { 'pt-BR': '3ª coluna', 'es-ES': '3ª columna' },
						value: 'third',
					}
				)
		)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription('amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)')
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ user, interaction, instance, member, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const falcoins = interaction.options.getString('falcoins');
			const player = await database.player.findOne(user.id);
			try {
				var bet = await numerize(falcoins, player.falcoins);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: falcoins,
					}),
				});
			}
			const displayColor = await instance.getUserDisplay('displayColor', member);

			if (player.falcoins >= bet) {
				player.falcoins -= bet;

				const embed = instance
					.createEmbed(displayColor)
					.setTitle(instance.getMessage(interaction, 'ROULETTE'))
					.setDescription(instance.getMessage(interaction, 'SPINNING_ROULETTE'))
					.setImage('https://media3.giphy.com/media/26uf2YTgF5upXUTm0/giphy.gif');
				await instance.editReply(interaction, {
					embeds: [embed],
				});

				const types = {
					green: [0],
					red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
					black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
					low: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
					high: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
					odd: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
					even: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
					first: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
					second: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
					third: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
				};

				var type = types[interaction.options.getString('type')];
				if (type === types['green']) {
					var profit = bet * 36;
				} else if (type === types['first'] || type === types['second'] || type === types['third']) {
					var profit = bet * 3;
				} else {
					var profit = bet * 2;
				}

				const luck = randint(0, 36);

				await new Promise((resolve) => setTimeout(resolve, 3000));

				var embed2 = instance.createEmbed(displayColor).setTitle(instance.getMessage(interaction, 'ROULETTE'));

				if (type.includes(luck)) {
					player.falcoins += profit;
					embed2.setColor(3066993).addFields(
						{
							name: instance.getMessage(interaction, 'YOU_WON') + ' :sunglasses:',
							value: instance.getMessage(interaction, 'ROLLED') + ` **${luck}**`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'WINNINGS'),
							value: `${format(profit)} falcoins`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'BALANCE'),
							value: `${format(player.falcoins)} falcoins`,
						}
					);
				} else {
					embed2.setColor(15158332).addFields(
						{
							name: instance.getMessage(interaction, 'YOU_LOST') + ' :pensive:',
							value: instance.getMessage(interaction, 'ROLLED') + ` **${luck}**`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'LOSSES'),
							value: `${format(bet)} falcoins`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'BALANCE'),
							value: `${format(player.falcoins)} falcoins`,
						}
					);
				}

				await instance.editReply(interaction, {
					embeds: [embed2],
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
			}
			player.save();
		} catch (error) {
			console.error(`roulette: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
