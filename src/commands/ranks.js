const { readFile, changeDB, format, paginate } = require('../utils/functions.js');
const { SlashCommandBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranks')
		.setDescription('Increase you rank')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('rankup')
				.setDescription('Increase you rank')
				.setDescriptionLocalization('pt-BR', 'Suba de rank')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalization('pt-BR', 'ver')
				.setDescription('View upcoming ranks')
				.setDescriptionLocalization('pt-BR', 'Veja os próximos ranks')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('all')
				.setNameLocalization('pt-BR', 'todos')
				.setDescription('View all ranks')
				.setDescriptionLocalization('pt-BR', 'Veja todos os ranks')
		),
	execute: async ({ guild, user, interaction, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const type = interaction.options.getSubcommand();
			const levels = instance.levels;

			if (type === 'rankup') {
				const rank_number = await readFile(user.id, 'rank');
				rank = levels[rank_number - 1];

				if (rank.falcoinsToLevelUp === undefined) {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'MAX_RANK', {
							USER: user,
						}),
					});
				} else if ((await readFile(user.id, 'falcoins')) < rank.falcoinsToLevelUp) {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'NO_MONEY_RANK', {
							FALCOINS: format(rank.falcoinsToLevelUp - (await readFile(user.id, 'falcoins'))),
						}),
					});
				} else {
					const new_rank = levels[rank_number];

					await changeDB(user.id, 'falcoins', -rank.falcoinsToLevelUp);
					await changeDB(user.id, 'rank', rank_number + 1, true);

					perks = await instance.rankPerks(rank, new_rank, interaction);

					var embed = instance.createEmbed(1752220).addFields(
						{
							name: 'Rank Up!',
							value: instance.getMessage(interaction, 'RANKUP_SUCESS', {
								RANK: instance.getMessage(interaction, String(rank_number + 1)),
								FALCOINS: format(rank.falcoinsToLevelUp),
							}),
						},
						{
							name: instance.getMessage(interaction, 'RANKUP_PERKS'),
							value: perks,
						}
					);

					await interaction.editReply({
						embeds: [embed],
					});
				}
			} else if (type === 'view') {
				const rank_number = await readFile(user.id, 'rank');
				if (levels[rank_number - 1].falcoinsToLevelUp === undefined) {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'MAX_RANK', {
							USER: user,
						}),
					});
					return;
				}

				var quantity = levels.length - rank_number;
				if (quantity > 3) {
					quantity = 3;
				}

				var embed = instance
					.createEmbed(7419530)
					.setTitle(instance.getMessage(interaction, 'UPCOMING_RANKS'))
					.addFields({
						name:
							instance.getMessage(interaction, String(rank_number)) +
							' - ' +
							format(levels[rank_number - 1].falcoinsToLevelUp) +
							' Falcoins' +
							instance.getMessage(interaction, 'CURRENT_RANK'),
						value: await instance.rankPerks(levels[rank_number - 2], levels[rank_number - 1], guild),
					});

				for (var i = 0; i < quantity; i++) {
					if (levels[rank_number + i].falcoinsToLevelUp === undefined) {
						embed.addFields({
							name:
								instance.getMessage(interaction, String(rank_number + i + 1)) +
								' - ' +
								instance.getMessage(interaction, 'MAX_RANK2'),
							value: await instance.rankPerks(levels[rank_number - 1 + i], levels[rank_number + i], guild),
						});
					} else {
						embed.addFields({
							name:
								instance.getMessage(interaction, String(rank_number + i + 1)) +
								' - ' +
								format(levels[rank_number + i].falcoinsToLevelUp) +
								' Falcoins',
							value: await instance.rankPerks(levels[rank_number - 1 + i], levels[rank_number + i], guild),
						});
					}
				}

				embed.setFooter({ text: 'by Falcão ❤️' });
				await interaction.editReply({ embeds: [embed] });
			} else {
				numEmbeds = Math.ceil(levels.length / 20);
				embeds = [];
				for (var i = 0; i < numEmbeds; i++) {
					var ranks = '';
					var index = i * 20;
					const ranksChunk = levels.slice(index, index + 20);

					var embed = instance.createEmbed('#71368A');

					for (var j = 0; j < ranksChunk.length; j++) {
						if (levels[j + i * 20].falcoinsToLevelUp === undefined) {
							ranks +=
								`**${instance.getMessage(interaction, String(j + i * 20 + 1))}** - ` +
								instance.getMessage(interaction, 'MAX_RANK2') +
								'\n';
						} else {
							ranks += `**${instance.getMessage(interaction, String(j + i * 20 + 1))}** - ${format(
								levels[j + i * 20].falcoinsToLevelUp
							)} falcoins\n`;
						}
					}

					embed
						.addFields({
							name: instance.getMessage(interaction, 'ALL_RANKS', { NUMBER: i + 1, TOTAL: numEmbeds }),
							value: ranks,
						})
						.setFooter({ text: 'by Falcão ❤️' });

					embeds.push(embed);
				}
				const paginator = paginate();
				paginator.add(...embeds);
				const ids = [`${Date.now()}__left`, `${Date.now()}__right`];
				paginator.setTraverser([
					new ButtonBuilder().setEmoji('⬅️').setCustomId(ids[0]).setStyle('Secondary'),
					new ButtonBuilder().setEmoji('➡️').setCustomId(ids[1]).setStyle('Secondary'),
				]);
				const message = await interaction.editReply(paginator.components());
				message.channel.createMessageComponentCollector().on('collect', async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back();
						await i.update(paginator.components());
					} else if (i.customId === ids[1]) {
						await paginator.next();
						await i.update(paginator.components());
					}
				});
			}
		} catch (err) {
			console.error(`ranks: ${err}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
