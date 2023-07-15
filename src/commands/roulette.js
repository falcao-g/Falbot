const { specialArg, readFile, randint, changeDB, format, getRoleColor } = require('../utils/functions.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roulette')
		.setNameLocalization('pt-BR', 'roleta')
		.setDescription('Bet on the roulette')
		.setDescriptionLocalization('pt-BR', 'Aposte na roleta')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('type')
				.setNameLocalization('pt-BR', 'tipo')
				.setDescription(
					'the columns have a 2-1 payout ratio, the green has a 35-1 (only one number) and the rest have a 1-1'
				)
				.setDescriptionLocalization(
					'pt-BR',
					'as colunas tem uma taxa de retorno de 2-1, o verde é 35-1 (só um número) e o resto 1-1'
				)
				.setRequired(true)
				.addChoices(
					{
						name: 'black',
						name_localizations: { 'pt-BR': 'preto' },
						value: 'black',
					},
					{
						name: 'red',
						name_localizations: { 'pt-BR': 'vermelho' },
						value: 'red',
					},
					{
						name: 'green',
						name_localizations: { 'pt-BR': 'verde' },
						value: 'green',
					},
					{
						name: 'high',
						name_localizations: { 'pt-BR': 'altos' },
						value: 'high',
					},
					{
						name: 'low',
						name_localizations: { 'pt-BR': 'baixos' },
						value: 'low',
					},
					{
						name: 'even',
						name_localizations: { 'pt-BR': 'par' },
						value: 'even',
					},
					{
						name: 'odd',
						name_localizations: { 'pt-BR': 'ímpar' },
						value: 'odd',
					},
					{
						name: '1st column',
						name_localizations: { 'pt-BR': '1ª coluna' },
						value: 'first',
					},
					{
						name: '2nd column',
						name_localizations: { 'pt-BR': '2ª coluna' },
						value: 'second',
					},
					{
						name: '3rd column',
						name_localizations: { 'pt-BR': '3ª coluna' },
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
	execute: async ({ guild, user, interaction, instance }) => {
		try {
			await interaction.deferReply();
			const falcoins = interaction.options.getString('falcoins');
			try {
				var bet = await specialArg(falcoins, user.id, 'falcoins');
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
			}

			if ((await readFile(user.id, 'falcoins')) >= bet) {
				await changeDB(user.id, 'falcoins', -bet);

				const embed = new EmbedBuilder()
					.setTitle(instance.getMessage(interaction, 'ROLETA'))
					.setDescription(instance.getMessage(interaction, 'GIRANDO_ROLETA'))
					.setColor(await getRoleColor(guild, user.id))
					.setImage('https://media3.giphy.com/media/26uf2YTgF5upXUTm0/giphy.gif')
					.setFooter({ text: 'by Falcão ❤️' });

				await interaction.editReply({
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

				var embed2 = new EmbedBuilder()
					.setTitle(instance.getMessage(interaction, 'ROLETA'))
					.setFooter({ text: 'by Falcão ❤️' });

				if (type.includes(luck)) {
					await changeDB(user.id, 'falcoins', profit);
					embed2.setColor(3066993).addFields(
						{
							name: instance.getMessage(interaction, 'VOCE_GANHOU') + ' :sunglasses:',
							value: instance.getMessage(interaction, 'BOT_ROLOU') + ` **${luck}**`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'GANHOS'),
							value: `${format(profit)} falcoins`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'SALDO_ATUAL'),
							value: `${await readFile(user.id, 'falcoins', true)} falcoins`,
						}
					);
				} else {
					embed2.setColor(15158332).addFields(
						{
							name: instance.getMessage(interaction, 'VOCE_PERDEU') + ' :pensive:',
							value: instance.getMessage(interaction, 'BOT_ROLOU') + ` **${luck}**`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'PERDAS'),
							value: `${format(bet)} falcoins`,
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'SALDO_ATUAL'),
							value: `${await readFile(user.id, 'falcoins', true)} falcoins`,
						}
					);
				}

				await interaction.editReply({
					embeds: [embed2],
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
				});
			}
		} catch (error) {
			console.error(`roulette: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
