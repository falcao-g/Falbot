const { format, paginate } = require('../../utils/functions.js');
const { SlashCommandBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranks')
		.setDescription('Increase you rank')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand.setName('rankup').setDescription('Increase you rank').setDescriptionLocalizations({
				'pt-BR': 'Suba de rank',
				'es-ES': 'Sube de rank',
			})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View upcoming ranks')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja os próximos ranks',
					'es-ES': 'Veja os próximos ranks',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('all')
				.setNameLocalizations({
					'pt-BR': 'todos',
					'es-ES': 'todos',
				})
				.setDescription('View all ranks')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja todos os ranks',
					'es-ES': 'Veja todos os ranks',
				})
		),
	execute: async ({ guild, user, interaction, instance, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const type = interaction.options.getSubcommand();
			const levels = instance.levels;
			const player = await database.player.findOne(user.id);

			if (type === 'rankup') {
				rank = levels[player.rank - 1];

				if (rank.falcoinsToLevelUp === undefined) {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'MAX_RANK', {
							USER: user,
						}),
					});
				} else if (player.falcoins < rank.falcoinsToLevelUp) {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_MONEY_RANK', {
							FALCOINS: format(rank.falcoinsToLevelUp - player.falcoins),
						}),
					});
				} else {
					const new_rank = levels[player.rank];

					player.falcoins -= rank.falcoinsToLevelUp;
					player.rank += 1;

					perks = await instance.rankPerks(rank, new_rank, interaction);

					var embed = instance.createEmbed(1752220).addFields(
						{
							name: 'Rank Up!',
							value: instance.getMessage(interaction, 'RANKUP_SUCESS', {
								RANK: instance.getMessage(interaction, String(player.rank + 1)),
								FALCOINS: format(rank.falcoinsToLevelUp),
							}),
						},
						{
							name: instance.getMessage(interaction, 'RANKUP_PERKS'),
							value: perks,
						}
					);

					await instance.editReply(interaction, {
						embeds: [embed],
					});
				}
			} else if (type === 'view') {
				if (levels[player.rank - 1].falcoinsToLevelUp === undefined) {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'MAX_RANK', {
							USER: user,
						}),
					});
					return;
				}

				var quantity = levels.length - player.rank;
				if (quantity > 3) {
					quantity = 3;
				}

				var embed = instance
					.createEmbed(7419530)
					.setTitle(instance.getMessage(interaction, 'UPCOMING_RANKS'))
					.addFields({
						name:
							instance.getMessage(interaction, String(player.rank)) +
							' - ' +
							format(levels[player.rank - 1].falcoinsToLevelUp) +
							' Falcoins' +
							instance.getMessage(interaction, 'CURRENT_RANK'),
						value: await instance.rankPerks(levels[player.rank - 2], levels[player.rank - 1], interaction),
					});

				for (var i = 0; i < quantity; i++) {
					if (levels[player.rank + i].falcoinsToLevelUp === undefined) {
						embed.addFields({
							name:
								instance.getMessage(interaction, String(player.rank + i + 1)) +
								' - ' +
								instance.getMessage(interaction, 'MAX_RANK2'),
							value: await instance.rankPerks(levels[player.rank - 1 + i], levels[player.rank + i], interaction),
						});
					} else {
						embed.addFields({
							name:
								instance.getMessage(interaction, String(player.rank + i + 1)) +
								' - ' +
								format(levels[player.rank + i].falcoinsToLevelUp) +
								' Falcoins',
							value: await instance.rankPerks(levels[player.rank - 1 + i], levels[player.rank + i], interaction),
						});
					}
				}

				embed.setFooter({ text: 'by Falcão ❤️' });
				await instance.editReply(interaction, { embeds: [embed] });
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
				const message = await instance.editReply(interaction, paginator.components());
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
			player.save();
		} catch (err) {
			console.error(`ranks: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
