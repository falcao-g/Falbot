const { randint, format } = require('../../utils/functions.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { numerize } = require('numerize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('crash')
		.setNameLocalizations({
			'pt-BR': 'colapso',
			'es-ES': 'colapso',
		})
		.setDescription('Sell at the right time before the market crashes')
		.setDescriptionLocalizations({
			'pt-BR': 'Venda no momento certo antes que o mercado colapse',
			'es-ES': 'Vende en el momento adecuado antes de que el mercado colapse',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('falcoins')
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalizations({
					'pt-BR': 'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
					'es-ES': 'la cantidad de falcoins para apostar (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
				})
				.setRequired(true)
		),
	execute: async ({ member, interaction, instance, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const falcoins = interaction.options.getString('falcoins');
			const player = await database.player.findOne(member.id);
			try {
				var bet = numerize(falcoins, player.falcoins);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: falcoins,
					}),
				});
				return;
			}
			if (player.falcoins >= bet) {
				player.falcoins -= bet;
				var multiplier = 10;
				const embed = instance.createEmbed(await instance.getUserDisplay('displayColor', member)).addFields(
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
						name: instance.getMessage(interaction, 'WINNINGS'),
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

				var answer = await instance.editReply(interaction, {
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
						name: instance.getMessage(interaction, 'WINNINGS'),
						value: `:coin: ${format(parseInt((bet * multiplier) / 10 - bet))}`,
						inline: true,
					};

					await instance.editReply(interaction, {
						embeds: [embed],
						components: [row],
					});
				}

				if (lost) {
					embed.setColor(15158332);
				} else {
					player.falcoins += parseInt((bet * multiplier) / 10);
					embed.setColor(3066993);
				}

				await instance.editReply(interaction, {
					embeds: [embed],
					components: [row],
				});
			} else {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
			}
			player.save();
		} catch (error) {
			console.error(`catch: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
