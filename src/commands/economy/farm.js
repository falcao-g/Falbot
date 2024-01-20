const {
	SlashCommandBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} = require('discord.js');
const { msToTime, getItem, randint } = require('../../utils/functions.js');
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
				.addUserOption((option) =>
					option
						.setName('user')
						.setNameLocalizations({
							'pt-BR': 'usuário',
							'es-ES': 'usuario',
						})
						.setDescription('The user you want to view the farm of')
						.setDescriptionLocalizations({
							'pt-BR': 'O usuário que você deseja ver a fazenda',
							'es-ES': 'El usuario que quieres ver la granja',
						})
						.setRequired(false)
				)
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
						.setAutocomplete(true)
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
				)
		),
	execute: async ({ interaction, instance, subcommand, member, args, guild }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var type = interaction.options.getSubcommand();
		} catch {
			var type = subcommand;
		}

		const WATER_COOLDOWN = 60 * 60 * 1000;

		const user = interaction.options && interaction.options.getUser('user', false);
		const target = user ? await guild.members.fetch(user.id) : member;
		const player = await User.findByIdAndUpdate(
			target.id,
			{},
			{ select: 'plots inventory rank', upsert: true, new: true }
		);
		const items = instance.items;

		const MAX_PLOTS = instance.levels[player.rank - 1].farmPlots;

		const embed = instance
			.createEmbed(target.displayColor)
			.setTitle(instance.getMessage(interaction, 'FARM_TITLE', { USER: target.displayName }));

		/**
		 * Renders buttons ignoring the specified type.
		 * @param {string} type - The type of button to ignore.
		 * @returns {ActionRowBuilder} - The ActionRowBuilder object containing the rendered buttons.
		 */
		function renderButtons(type) {
			const availableButtons = [
				new ButtonBuilder()
					.setCustomId('farm view')
					.setEmoji('🏞️')
					.setLabel(instance.getMessage(interaction, 'VIEW'))
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('farm plant')
					.setEmoji('🌱')
					.setLabel(instance.getMessage(interaction, 'PLANT'))
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('farm water')
					.setEmoji('💦')
					.setLabel(instance.getMessage(interaction, 'WATER'))
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId('farm harvest')
					.setEmoji('🚜')
					.setLabel(instance.getMessage(interaction, 'HARVEST'))
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('farm uproot')
					.setEmoji('🪓')
					.setLabel(instance.getMessage(interaction, 'UPROOT'))
					.setStyle(ButtonStyle.Danger),
			];

			const filteredButtons = availableButtons.filter((button) => type !== button.toJSON().custom_id.split(' ')[1]);

			return new ActionRowBuilder().addComponents(...filteredButtons);
		}

		/**
		 * Renders the plots for the farm.
		 * @param {Array} newPlot - An array of new plots.
		 * @returns {Array} - An array of plot objects with name, value, and inline properties.
		 */
		function renderPlots({ newPlot = [] }) {
			return player.plots.map((plot, index) => {
				const timeLeft = plot.harvestTime - Date.now();

				const cropEmoji = items[plot.crop].emoji;

				const crop = timeLeft > 0 ? '🌱' : cropEmoji;

				return {
					name: `${instance.getMessage(interaction, 'PLOT')} ${index + 1} ${
						plot.lastWatered + WATER_COOLDOWN > Date.now() ? '💧' : ''
					} *(${msToTime(plot.lastWatered + WATER_COOLDOWN - Date.now())})* ${newPlot.includes(index) ? '❇️' : ''}`,
					value: `${crop.repeat(6)}\n${
						timeLeft > 0
							? instance.getMessage(interaction, 'REMAINING_TIME', {
									CROP: cropEmoji,
									TIME: msToTime(timeLeft),
							  })
							: `**${instance.getMessage(interaction, 'READY_TO_HARVEST')}**`
					}`,
					inline: true,
				};
			});
		}

		if (type === 'view') {
			embed
				.setDescription(
					instance.getMessage(interaction, 'WATERING_TIP') +
						'\n\n' +
						instance.getMessage(interaction, 'PLOTS_AVAILABLE', {
							CURRENT: MAX_PLOTS - player.plots.length,
							MAX: MAX_PLOTS,
						})
				)
				.addFields(
					player.plots.length > 0
						? [...renderPlots({})]
						: {
								name: instance.getMessage(interaction, 'NO_PLOTS'),
								value: instance.getMessage(interaction, 'NO_PLOTS_HINT'),
						  }
				);
		} else if (type === 'plant') {
			let cropName;
			if (interaction.options !== undefined) {
				cropName = interaction.options.getString('crop');
			} else if (interaction.values !== undefined) {
				cropName = interaction.values[0];
			} else {
				cropName = args[1];
			}

			// If no crop name is provided, show a list of crops that can be planted.
			if (!cropName) {
				const cropsKeys = Object.keys(items).filter((key) => items[key].hasOwnProperty('growTime'));
				const canPlant = cropsKeys.map((cropKey) => {
					const cropJSON = items[cropKey];

					return {
						label: cropJSON[interaction.locale] ?? cropJSON['en-US'],
						value: cropKey,
						description: `${msToTime(cropJSON.growTime)} | ${cropJSON.harvestAmount.min}x-${
							cropJSON.harvestAmount.max
						}x`,
						emoji: instance.getItemEmoji(cropKey),
					};
				});

				const row = new ActionRowBuilder().addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('farm plant')
						.setPlaceholder(instance.getMessage(interaction, 'SELECT_CROP_PLACEHOLDER'))
						.addOptions(canPlant),
				]);

				embed.setDescription(
					instance.getMessage(interaction, 'SELECT_CROP', { AMOUNT: MAX_PLOTS - player.plots.length })
				);

				interaction.editReply({ embeds: [embed], components: [row] });
				return;
			}

			const cropKey = getItem(cropName);
			const cropJSON = items[cropKey];

			if (cropJSON === undefined || !cropJSON.hasOwnProperty('growTime')) {
				embed.setDescription(instance.getMessage(interaction, 'INVALID_CROP'));
			} else if (player.plots.length >= MAX_PLOTS) {
				embed.setDescription(instance.getMessage(interaction, 'NO_PLOTS_AVAILABLE'));
			} else {
				// Add the plot to the player's plots array.
				player.plots.push({
					crop: cropKey,
					harvestTime: Date.now() + cropJSON.growTime,
				});
				await player.save();

				embed
					.setDescription(
						`${instance.getMessage(interaction, 'PLANTED')} **${instance.getItemName(cropKey, interaction)}**!`
					)
					.addFields(...renderPlots({ newPlot: [player.plots.length - 1] }));
			}
		} else if (type === 'water') {
			const plotsWatered = [];

			// Loop through each plot and water all crops.
			player.plots.forEach((plot, index) => {
				if (plot.lastWatered + WATER_COOLDOWN <= Date.now()) {
					plot.harvestTime -= 45 * 60 * 1000;
					plot.lastWatered = Date.now();
					plotsWatered.push(index);
				}
			});
			await player.save();

			if (plotsWatered.length === 0) {
				embed.setDescription(instance.getMessage(interaction, 'NO_PLOTS_WATERED'));
			} else {
				embed
					.setDescription(instance.getMessage(interaction, 'PLOTS_WATERED', { AMOUNT: plotsWatered.length }))
					.addFields(...renderPlots({}));
			}
		} else if (type === 'harvest') {
			if (player.plots.length === 0) {
				embed.setDescription(instance.getMessage(interaction, 'NO_CROPS_TO_HARVEST'));
			} else {
				const harvestedCrops = {};
				let total = 0;

				// Loop through each plot and harvest the crops that are ready.
				for (let i = player.plots.length - 1; i >= 0; i--) {
					if (player.plots[i].harvestTime <= Date.now()) {
						const cropKey = player.plots[i].crop;
						const cropJSON = items[cropKey];

						const amount = randint(cropJSON.harvestAmount.min, cropJSON.harvestAmount.max);
						total += amount;

						await player.inventory.set(cropKey, (player.inventory.get(cropKey) || 0) + amount);
						await player.plots.splice(i, 1);
						harvestedCrops[cropKey] = (harvestedCrops[cropKey] || 0) + amount;
					}
				}
				await player.save();

				if (total === 0) {
					embed.setDescription(instance.getMessage(interaction, 'NO_CROPS_HARVESTED'));
				} else {
					embed.addFields({
						name: instance.getMessage(interaction, 'CROPS_HARVESTED', { AMOUNT: total }),
						value: Object.keys(harvestedCrops)
							.map((cropKey) => `**${instance.getItemName(cropKey, interaction)}** x ${harvestedCrops[cropKey]}`)
							.join('\n'),
					});
				}
			}
		} else if (type === 'uproot') {
			let plotIndex;
			if (interaction.options !== undefined) {
				plotIndex = interaction.options.getInteger('plot');
			} else if (interaction.values !== undefined) {
				plotIndex = interaction.values[0];
			} else {
				plotIndex = args[1];
			}

			// If no plot index is provided, show a list of plots that can be uprooted.
			if (!plotIndex) {
				const options = [];
				for (let i = 0; i < player.plots.length; i++) {
					options.push({
						label: `${instance.getMessage(interaction, 'PLOT')} ${i + 1}`,
						value: (i + 1).toString(),
						description: `${msToTime(player.plots[i].harvestTime - Date.now())} ${instance.getMessage(
							interaction,
							'REMAINING'
						)}`,
						emoji: instance.getItemEmoji(player.plots[i].crop),
					});
				}

				const row = new ActionRowBuilder().addComponents([
					new StringSelectMenuBuilder()
						.setCustomId('farm uproot')
						.setPlaceholder(instance.getMessage(interaction, 'SELECT_PLOT_PLACEHOLDER'))
						.addOptions(options),
				]);

				embed.setDescription(instance.getMessage(interaction, 'SELECT_PLOT')).addFields(...renderPlots({}));

				interaction.editReply({ embeds: [embed], components: [row] });
				return;
			}

			if (player.plots.length === 0) {
				embed.setDescription(instance.getMessage(interaction, 'NO_CROPS_TO_UPROOT'));
			} else if (plotIndex > player.plots.length || plotIndex <= 0) {
				embed.setDescription(instance.getMessage(interaction, 'INVALID_PLOT'));
			} else {
				const cropKey = player.plots[plotIndex - 1].crop;

				// Remove the plot from the player's plots array.
				player.plots.splice(plotIndex - 1, 1);
				await player.save();

				embed.setDescription(
					instance.getMessage(interaction, 'PLOTS_UPRROTED', {
						CROP: instance.getItemName(cropKey, interaction),
						INDEX: plotIndex,
					})
				);
			}
		}

		// Render embed and buttons.
		interaction.editReply({ embeds: [embed], components: [renderButtons(type)] });
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();

		const cropsKeys = Object.keys(instance.items).filter((key) => instance.items[key].hasOwnProperty('growTime'));
		const localeCrops = cropsKeys.map((key) => instance.getItemName(key, interaction));
		const filtered = localeCrops.filter((choice) => {
			const lowerCaseChoice = choice.toLowerCase();
			return (
				lowerCaseChoice.startsWith(focusedValue) ||
				lowerCaseChoice.split(' ').slice(1).join(' ').startsWith(focusedValue)
			);
		});

		await interaction.respond(filtered.slice(0, 25).map((choice) => ({ name: choice, value: choice })));
	},
};
