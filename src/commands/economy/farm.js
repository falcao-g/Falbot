const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { msToTime, getItem } = require('../../utils/functions.js');
const User = require('../../schemas/user-schema.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('farm')
		.setNameLocalizations({
			'pt-BR': 'fazenda',
			'es-ES': 'granja',
		})
		.setDescription('Farm commands')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View your farm')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja sua fazenda',
					'es-ES': 'Ve tu granja',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('plant')
				.setNameLocalizations({
					'pt-BR': 'plantar',
					'es-ES': 'plantar',
				})
				.setDescription('Plant a crop')
				.setDescriptionLocalizations({
					'pt-BR': 'Plante uma safra',
					'es-ES': 'Planta un cultivo',
				})
				.addStringOption((option) =>
					option
						.setName('crop')
						.setNameLocalizations({
							'pt-BR': 'cultura',
							'es-ES': 'cultivo',
						})
						.setDescription('Crop to plant')
						.setDescriptionLocalizations({
							'pt-BR': 'Cultura para plantar',
							'es-ES': 'Cultivo para plantar',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('water')
				.setNameLocalizations({
					'pt-BR': 'regar',
					'es-ES': 'regar',
				})
				.setDescription('Water a crop')
				.setDescriptionLocalizations({
					'pt-BR': 'Regue uma safra',
					'es-ES': 'Riega un cultivo',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('harvest')
				.setNameLocalizations({
					'pt-BR': 'colher',
					'es-ES': 'cosechar',
				})
				.setDescription('Harvest a crop')
				.setDescriptionLocalizations({
					'pt-BR': 'Colha uma safra',
					'es-ES': 'Cosecha un cultivo',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('uproot')
				.setNameLocalizations({
					'pt-BR': 'arrancar',
					'es-ES': 'arrancar',
				})
				.setDescription('Uproot a crop')
				.setDescriptionLocalizations({
					'pt-BR': 'Arranque uma safra',
					'es-ES': 'Arranca un cultivo',
				})
				.addIntegerOption((option) =>
					option
						.setName('plot')
						.setNameLocalizations({
							'pt-BR': 'safra',
							'es-ES': 'cultivo',
						})
						.setDescription('Plot to uproot')
						.setDescriptionLocalizations({
							'pt-BR': 'Safra para arrancar',
							'es-ES': 'Cultivo para arrancar',
						})
						.setRequired(true)
				)
		),
	execute: async ({ interaction, instance, subcommand, member }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var type = interaction.options.getSubcommand();
		} catch {
			var type = subcommand;
		}

		const player = await User.findByIdAndUpdate(member.id, {}, { select: 'plots inventory', upsert: true, new: true });

		const viewButton = new ButtonBuilder().setCustomId('farm view').setLabel('🏡').setStyle(ButtonStyle.Primary);

		const plantButton = new ButtonBuilder()
			.setCustomId('farm plant')
			.setLabel('🌱')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const harvestButton = new ButtonBuilder().setCustomId('farm harvest').setLabel('🚜').setStyle(ButtonStyle.Success);

		const uprootButton = new ButtonBuilder()
			.setCustomId('farm uproot')
			.setLabel('🔨')
			.setStyle(ButtonStyle.Danger)
			.setDisabled(true);

		if (type === 'view') {
			const plots = player.plots.map((plot, index) => {
				const timeLeft = plot.harvestTime - Date.now();

				const cropEmoji = instance.items[plot.crop].emoji;

				const crop = timeLeft > 0 ? '🌱' : cropEmoji;

				return {
					name: `Plot ${index + 1}`,
					value: `${crop.repeat(6)}\n${
						timeLeft > 0 ? `${cropEmoji} in ${msToTime(timeLeft)}` : '**Ready to harvest!**'
					}`,
					inline: true,
				};
			});

			const embed = instance
				.createEmbed()
				.setTitle(`🏞️ ${member.displayName}'s Farm`)
				.setColor(member.displayColor)
				.setDescription('💦 **Water crops to lower grow time!**')
				.addFields(plots.length > 0 ? [...plots] : { name: 'No plots', value: 'Use `/farm plant` to plant a crop!' });

			const row = new ActionRowBuilder().addComponents(plantButton, harvestButton, uprootButton);

			interaction.editReply({ embeds: [embed], components: [row] });
		} else if (type === 'plant') {
			const cropName = interaction.options.getString('crop');

			if (player.plots.length >= 6) {
				const embed = instance.createEmbed(member.displayColor).setTitle(`🏞️ ${member.displayName}'s Farm`);
				embed.setDescription('You have no more plots!');

				return interaction.editReply({ embeds: [embed] });
			}

			const cropKey = getItem(cropName);
			const cropJSON = instance.items[cropKey];

			player.plots.push({
				crop: cropKey,
				harvestTime: Date.now() + cropJSON.growTime,
			});
			await player.save();

			const embed = instance
				.createEmbed(member.displayColor)
				.setTitle(`🏞️ ${member.displayName}'s Farm`)
				.setDescription(`Planted **${instance.getItemName(cropKey, interaction)}**!`);
			const row = new ActionRowBuilder().addComponents(viewButton, harvestButton, uprootButton);

			interaction.editReply({ embeds: [embed], components: [row] });
		} else if (type === 'water') {
			const embed = instance.createEmbed(member.displayColor).setTitle(`🏞️ ${member.displayName}'s Farm`);

			if (player.plots.length === 0) {
				embed.setDescription('You have no crops to water!');

				return interaction.editReply({ embeds: [embed] });
			}

			let total = 0;

			player.plots.forEach((plot) => {
				if (plot.lastWatered + 60 * 60 * 1000 <= Date.now()) {
					plot.harvestTime -= 45 * 60 * 1000;
					plot.lastWatered = Date.now();
					total++;
				}
			});

			await player.save();

			if (total === 0) {
				embed.setDescription('No plots were watered!');
			} else {
				embed.setDescription(`Watered ${total} plots!`);
			}

			interaction.editReply({ embeds: [embed] });
		} else if (type === 'harvest') {
			const embed = instance.createEmbed(member.displayColor).setTitle(`🏞️ ${member.displayName}'s Farm`);
			const row = new ActionRowBuilder().addComponents(viewButton, plantButton, uprootButton);

			if (player.plots.length === 0) {
				embed.setDescription('You have no crops to harvest!');

				return interaction.editReply({ embeds: [embed], components: [row] });
			}

			const harvestedCrops = {};
			let total = 0;

			player.plots.forEach((plot, index) => {
				if (plot.harvestTime <= Date.now()) {
					const cropKey = plot.crop;

					const amount = 6;
					total += amount;

					player.inventory.set(cropKey, (player.inventory.get(cropKey) || 0) + amount);
					player.plots.splice(index, 1);
					harvestedCrops[cropKey] = (harvestedCrops[cropKey] || 0) + amount;
				}
			});
			await player.save();

			if (total === 0) {
				embed.setDescription('No crops were harvested!');
			} else {
				embed.addFields({
					name: `🚜 ${total} crops harvested!`,
					value: Object.keys(harvestedCrops)
						.map((cropKey) => `**${instance.getItemName(cropKey, interaction)}** x ${harvestedCrops[cropKey]}`)
						.join('\n'),
				});
			}

			interaction.editReply({ embeds: [embed], components: [row] });
		} else if (type === 'uproot') {
			const plot = interaction.options.getInteger('plot');

			const embed = instance.createEmbed(member.displayColor).setTitle(`🏞️ ${member.displayName}'s Farm`);
			const row = new ActionRowBuilder().addComponents(viewButton, plantButton, harvestButton);

			if (player.plots.length === 0) {
				embed.setDescription('You have no crops to uproot!');

				return interaction.editReply({ embeds: [embed], components: [row] });
			}

			if (plot > player.plots.length || plot <= 0) {
				embed.setDescription('Invalid plot!');

				return interaction.editReply({ embeds: [embed], components: [row] });
			}

			const cropKey = player.plots[plot - 1].crop;

			player.plots.splice(plot - 1, 1);
			await player.save();

			embed.setDescription(`Uprooted **${instance.getItemName(cropKey, interaction)}**! from plot ${plot}`);

			interaction.editReply({ embeds: [embed], components: [row] });
		}
	},
};

// TODO: Add translations
// TODO: Add more crops
// TODO: Add more buttons
