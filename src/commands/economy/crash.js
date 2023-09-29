const { specialArg, readFile, randint, changeDB, format } = require('../../utils/functions.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crash')
		.setNameLocalization('pt-BR', 'colapso')
		.setDescription('Sell at the right time before the market crashes')
		.setDescriptionLocalization('pt-BR', 'Venda no momento certo antes que o mercado colapse')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					'pt-BR',
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ member, interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			try {
				var bet = await specialArg(falcoins, member.id, 'falcoins');
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: falcoins,
					}),
				});
				return;
			}
			if ((await readFile(member.id, 'falcoins')) >= bet) {
				await changeDB(member.id, 'falcoins', -bet);
				multiplier = 10;
				const embed = instance.createEmbed(member.displayColor).addFields(
					{
						name: 'Crash',
						value: instance.getMessage(interaction, 'CRASH_TEXT'),
						inline: false,
					},
					{
						name: instance.getMessage(interaction, 'MULTIPLIER'),
						value: `${(multiplier / 10).toFixed(1)}x`,
						inline: true,
					},
					{
						name: instance.getMessage(interaction, 'GANHOS'),
						value: `:coin: ${format(parseInt((bet * multiplier) / 10 - bet))}`,
						inline: true,
					}
				);

				const row = new ActionRowBuilder().addComponents(
					(sell = new ButtonBuilder()
						.setCustomId('sell')
						.setLabel(instance.getMessage(interaction, 'SELL'))
						.setStyle('Danger'))
				);

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member.id;
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					max: 1,
				});

				var crashed = false;
				var lost = false;

				collector.on('collect', async (i) => {
					crashed = true;

					await i.update({
						embeds: [embed],
						components: [row],
					});
				});

				while (!crashed) {
					await new Promise((resolve) => setTimeout(resolve, 2000));

					if (crashed) {
						break;
					}

					multiplier += 2;

					random = randint(1, 100);

					if (random <= 20) {
						crashed = true;
						lost = true;
					}

					embed.data.fields[1] = {
						name: instance.getMessage(interaction, 'MULTIPLIER'),
						value: `${(multiplier / 10).toFixed(1)}x`,
						inline: true,
					};
					embed.data.fields[2] = {
						name: instance.getMessage(interaction, 'GANHOS'),
						value: `:coin: ${format(parseInt((bet * multiplier) / 10 - bet))}`,
						inline: true,
					};

					await interaction.editReply({
						embeds: [embed],
						components: [row],
					});
				}
				sell.setDisabled(true);

				if (lost) {
					embed.setColor(15158332);
				} else {
					await changeDB(member.id, 'falcoins', parseInt((bet * multiplier) / 10));
					embed.setColor(3066993);
				}

				await interaction.editReply({
					embeds: [embed],
					components: [row],
				});
			} else {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'FALCOINS_INSUFICIENTES'),
				});
			}
		} catch (error) {
			console.error(`catch: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
