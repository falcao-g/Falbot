const { format, paginate, getItem, buttons, isEquipped, specialArg } = require('../../utils/functions.js');
const { ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName('market')
		.setNameLocalizations({
			'pt-BR': 'mercado',
			'es-ES': 'mercado',
		})
		.setDescription('Market commands')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('all')
				.setNameLocalizations({
					'pt-BR': 'tudo',
					'es-ES': 'todo',
				})
				.setDescription('View all items in the market')
				.setDescriptionLocalizations({
					'pt-BR': 'Ver todos os itens no mercado',
					'es-ES': 'Ver todos los items en el mercado',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View an item in the market')
				.setDescriptionLocalizations({
					'pt-BR': 'Ver um item no mercado',
					'es-ES': 'Ver un item en el mercado',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item to view')
						.setDescriptionLocalizations({
							'pt-BR': 'O item para ver',
							'es-ES': 'El item para ver',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	execute: async ({ guild, interaction, instance, member, subcommand, args, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			try {
				var type = interaction.options.getSubcommand();
			} catch {
				var type = subcommand;
			}
			const items = instance.items;

			if (type == 'all') {
				//first filter the mythical items, because they are not supposed to be in the market
				const filteredItems = Object.entries(items).filter((item) => {
					return item[1].mythical != true;
				});

				//create an array of embeds, each embed containing 3 columns with 5 items each, until all items are displayed
				const numberOfPages = Math.ceil(filteredItems.length / 15);
				const embeds = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const embed = instance.createEmbed(member.displayColor).setTitle(
							instance.getMessage(interaction, 'MARKET_TITLE', {
								PAGE: i + 1,
								TOTAL: numberOfPages,
							})
						);

						const itemsOnPage = filteredItems.slice(i * 15, (i + 1) * 15);
						for (var item of itemsOnPage) {
							var cheapestSellOrder = await database.market.getCheapestSellOrder(item[0]);
							embed.addFields({
								name: instance.getItemName(item[0], interaction),
								value:
									cheapestSellOrder == Infinity
										? instance.getMessage(interaction, 'NO_LISTINGS')
										: `${format(cheapestSellOrder)} falcoins`,
								inline: true,
							});
						}

						return embed;
					})
				);

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
			} else if (type === 'view') {
				const item = interaction.options.getString('item');
				const itemKey = getItem(item);
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: item,
						}),
					});
					return;
				}

				if (!itemJSON.value) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'CANT_SELL'),
					});
					return;
				}

				const embed = instance.createEmbed(member.displayColor).setTitle(instance.getItemName(itemKey, interaction));

				//retrieve all buy orders and group them by price, putting the highest price first, and formatting the string like x falcoins - y availables
				const buyOrders = await database.market.getBuyOrders(itemKey);
				if (buyOrders != []) {
					var groupedBuyOrders = {};
					buyOrders.forEach((order) => {
						if (groupedBuyOrders[order.price]) groupedBuyOrders[order.price]++;
						else groupedBuyOrders[order.price] = 1;
					});
					var formattedBuyOrders = Object.entries(groupedBuyOrders)
						.sort((a, b) => b[0] - a[0])
						.map(
							(order) =>
								`${instance.getItemEmoji(itemKey)} **${format(order[0])} falcoins** - ${format(
									order[1]
								)} ${instance.getMessage(interaction, 'AVAILABLES')}`
						);
				}

				//retrieve all sell orders and group them by price, putting the lowest price first, and formatting the string like x falcoins (y orders)
				const sellOrders = await database.market.getSellOrders(itemKey);
				if (sellOrders != []) {
					var groupedSellOrders = {};
					sellOrders.forEach((order) => {
						if (groupedSellOrders[order.price]) groupedSellOrders[order.price]++;
						else groupedSellOrders[order.price] = 1;
					});
					var formattedSellOrders = Object.entries(groupedSellOrders)
						.sort((a, b) => b[0] - a[0])
						.map(
							(order) =>
								`${instance.getItemEmoji(itemKey)} **${format(order[0])} falcoins** - ${format(
									order[1]
								)} ${instance.getMessage(interaction, 'AVAILABLES')}`
						);
				}

				//add the buy and sell orders to the embed
				embed.addFields({
					name: instance.getMessage(interaction, 'BUYERS'),
					value: buyOrders.length > 0 ? formattedBuyOrders.join('\n') : instance.getMessage(interaction, 'NO_LISTINGS'),
					inline: false,
				});
				embed.addFields({
					name: instance.getMessage(interaction, 'SELLERS'),
					value:
						sellOrders.length > 0 ? formattedSellOrders.join('\n') : instance.getMessage(interaction, 'NO_LISTINGS'),
					inline: false,
				});
				instance.editReply(interaction, { embeds: [embed] });
			}
		} catch (err) {
			console.error(`market: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const items = instance.items;

		var localeItems = Object.keys(items).map((key) => {
			return instance.getItemName(key, interaction);
		});

		const filtered = localeItems.filter((choice) => {
			if (
				choice.split(' ').slice(1).join(' ').toLowerCase().startsWith(focusedValue) ||
				choice.toLowerCase().startsWith(focusedValue)
			) {
				return true;
			}
		});
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
	},
};
