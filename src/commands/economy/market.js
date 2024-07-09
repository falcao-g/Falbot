const { format, paginate, getItem } = require('../../utils/functions.js');
const { ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
const { numerize } = require('numerize');

module.exports = {
	developer: false,
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
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('buy')
				.setNameLocalizations({ 'pt-BR': 'comprar', 'es-ES': 'comprar' })
				.setDescription('Buy an item')
				.setDescriptionLocalizations({
					'pt-BR': 'Comprar um item',
					'es-ES': 'Comprar un item',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item to buy')
						.setDescriptionLocalizations({
							'pt-BR': 'O item para comprar',
							'es-ES': 'El item para comprar',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setDescription('The amount of items to buy')
						.setDescriptionLocalizations({
							'pt-BR': 'A quantidade de itens para comprar',
							'es-ES': 'La cantidad de items para comprar',
						})
						.setRequired(true)
				)
		)

		.addSubcommandGroup((subcommandGroup) =>
			subcommandGroup
				.setName('list')
				.setNameLocalizations({ 'pt-BR': 'anunciar', 'es-ES': 'anunciar' })
				.setDescription('List an item in the market')
				.setDescriptionLocalizations({
					'pt-BR': 'Anunciar um item no mercado',
					'es-ES': 'Anunciar un item en el mercado',
				})
				.addSubcommand((subcommand) =>
					subcommand
						.setName('buy')
						.setNameLocalizations({ 'pt-BR': 'compra', 'es-ES': 'compra' })
						.setDescription('List a buy order in the market')
						.setDescriptionLocalizations({
							'pt-BR': 'Anunciar uma compra no mercado',
							'es-ES': 'Anunciar una compra en el mercado',
						})
						.addStringOption((option) =>
							option
								.setName('item')
								.setDescription('The item to buy')
								.setDescriptionLocalizations({
									'pt-BR': 'O item para comprar',
									'es-ES': 'El item para comprar',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
						.addStringOption((option) =>
							option
								.setName('amount')
								.setDescription('The amount of items to buy')
								.setDescriptionLocalizations({
									'pt-BR': 'A quantidade de itens para comprar',
									'es-ES': 'La cantidad de items para comprar',
								})
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName('price')
								.setDescription('The price of each individual item')
								.setDescriptionLocalizations({
									'pt-BR': 'O preço de cada item individual',
									'es-ES': 'El precio de cada item individual',
								})
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('sell')
						.setNameLocalizations({ 'pt-BR': 'venda', 'es-ES': 'venda' })
						.setDescription('List a sell order in the market')
						.setDescriptionLocalizations({
							'pt-BR': 'Anunciar uma venda no mercado',
							'es-ES': 'Anunciar una venta en el mercado',
						})
						.addStringOption((option) =>
							option
								.setName('item')
								.setDescription('The item to sell')
								.setDescriptionLocalizations({
									'pt-BR': 'O item para vender',
									'es-ES': 'El item para vender',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
						.addStringOption((option) =>
							option
								.setName('amount')
								.setDescription('The amount of items to sell')
								.setDescriptionLocalizations({
									'pt-BR': 'A quantidade de itens para vender',
									'es-ES': 'La cantidad de items para vender',
								})
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName('price')
								.setDescription('The price of each individual item')
								.setDescriptionLocalizations({
									'pt-BR': 'O preço de cada item individual',
									'es-ES': 'El precio de cada item individual',
								})
								.setRequired(true)
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('listings')
				.setNameLocalizations({ 'pt-BR': 'listagens', 'es-ES': 'listagens' })
				.setDescription('View your listings')
				.setDescriptionLocalizations({ 'pt-BR': 'Ver suas listagens', 'es-ES': 'Ver tus listagens' })
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({ 'pt-BR': 'tipo', 'es-ES': 'tipo' })
						.setDescription('The type of listings to view')
						.setDescriptionLocalizations({
							'pt-BR': 'O tipo de listagens para ver',
							'es-ES': 'El tipo de listagens para ver',
						})
						.setRequired(true)
						.addChoices(
							{
								name: 'buy',
								name_localizations: { 'pt-BR': 'compra', 'es-ES': 'compra' },
								value: 'buy',
							},
							{
								name: 'sell',
								name_localizations: { 'pt-BR': 'venda', 'es-ES': 'venda' },
								value: 'sell',
							}
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('delist')
				.setNameLocalizations({ 'pt-BR': 'retirar', 'es-ES': 'retirar' })
				.setDescription('Delist a listing')
				.setDescriptionLocalizations({ 'pt-BR': 'Retirar uma listagem', 'es-ES': 'Retirar una listagem' })
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({ 'pt-BR': 'tipo', 'es-ES': 'tipo' })
						.setDescription('The type of listing to delist')
						.setDescriptionLocalizations({
							'pt-BR': 'O tipo de listagem para retirar',
							'es-ES': 'El tipo de listagem para retirar',
						})
						.setRequired(true)
						.addChoices(
							{ name: 'buy', name_localizations: { 'pt-BR': 'compra', 'es-ES': 'compra' }, value: 'buy' },
							{ name: 'sell', name_localizations: { 'pt-BR': 'venda', 'es-ES': 'venda' }, value: 'sell' }
						)
				)
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item to delist')
						.setDescriptionLocalizations({ 'pt-BR': 'O item para retirar', 'es-ES': 'El item para retirar' })
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('history')
				.setNameLocalizations({ 'pt-BR': 'histórico', 'es-ES': 'histórico' })
				.setDescription('View the market history for an item')
				.setDescriptionLocalizations({
					'pt-BR': 'Ver o histórico do mercado para um item',
					'es-ES': 'Ver el histórico del mercado para un item',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('The item to view the history for')
						.setDescriptionLocalizations({
							'pt-BR': 'O item para ver o histórico',
							'es-ES': 'El item para ver el histórico',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	execute: async ({ interaction, instance, member, subcommand, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			var type = interaction.options.getSubcommand();
			var subcommandGroup = interaction.options.getSubcommandGroup();
		} catch {
			var type = subcommand;
		}
		const { items } = instance;

		if (type == 'all') {
			//first filter the mythical items, because they are not supposed to be in the market
			const filteredItems = Object.entries(items).filter((item) => {
				return item[1].mythical != true;
			});

			// pre calculate the sections of items
			const numberOfPages = Math.ceil(filteredItems.length / 15);
			const itemsOnPage = {};
			for (var i = 0; i < numberOfPages; i++) {
				itemsOnPage[i] = filteredItems.slice(i * 15, (i + 1) * 15);
			}

			//create an array of embeds, each embed containing 3 columns with 5 items each, until all items are displayed
			const embeds = await Promise.all(
				Array.from({ length: numberOfPages }).map(async (_, i) => {
					const embed = instance.createEmbed(member.displayColor).setTitle(
						instance.getMessage(interaction, 'MARKET_TITLE', {
							PAGE: i + 1,
							TOTAL: numberOfPages,
						})
					);

					for (var item of itemsOnPage[i]) {
						var cheapestSellOrder = await database.market.getCheapestSellOrder(item[0]);
						embed.addFields({
							name: instance.getItemName(item[0], interaction),
							value:
								cheapestSellOrder.price == Infinity
									? instance.getMessage(interaction, 'NO_LISTINGS')
									: `${format(cheapestSellOrder.price)} falcoins`,
							inline: true,
						});
					}

					return embed;
				})
			);

			// create a select menu for each embed with the items on that page
			const selectMenus = await Promise.all(
				Array.from({ length: numberOfPages }).map(async (_, i) => {
					const options = itemsOnPage[i].map((item) => {
						return {
							label: instance.getItemName(item[0], interaction),
							value: item[0],
						};
					});
					const select = new StringSelectMenuBuilder()
						.setCustomId(`market view`)
						.setPlaceholder(instance.getMessage(interaction, 'MARKET_MENU'))
						.addOptions(options);

					return select;
				})
			);

			const paginator = paginate();
			paginator.add(...embeds);
			paginator.addComponents(...selectMenus);
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
			if (interaction.options !== undefined) {
				var item = interaction.options.getString('item');
			} else {
				var item = interaction.values[0];
			}
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
					if (groupedBuyOrders[order.price]) groupedBuyOrders[order.price] += order.amount;
					else groupedBuyOrders[order.price] = order.amount;
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
					if (groupedSellOrders[order.price]) groupedSellOrders[order.price] + order.amount;
					else groupedSellOrders[order.price] = order.amount;
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
				value: sellOrders.length > 0 ? formattedSellOrders.join('\n') : instance.getMessage(interaction, 'NO_LISTINGS'),
				inline: false,
			});
			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'buy' && subcommandGroup == null) {
			const item = interaction.options.getString('item');
			const itemKey = getItem(item);
			const itemJSON = items[itemKey];
			const userFile = await database.player.findOne(member.id);

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

			try {
				var amountArgument = await numerize(interaction.options.getString('amount'), Number.MAX_SAFE_INTEGER);
				var amount = amountArgument;
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('amount'),
					}),
				});
			}

			//glutton algorithm to get the cheapest sell order
			var totalPaid = 0;
			while (
				amount > 0 &&
				(await database.market.getCheapestSellOrder(itemKey)).price != Infinity &&
				userFile.falcoins > 0
			) {
				const sellOrder = await database.market.getCheapestSellOrder(itemKey);
				const sellerFile = await database.player.findOne(sellOrder.owner);
				if (amount >= sellOrder.amount) {
					amount -= sellOrder.amount;
					userFile.falcoins -= sellOrder.price * sellOrder.amount;
					totalPaid += sellOrder.price * sellOrder.amount;
					userFile.inventory.set(itemKey, (userFile.inventory.get(itemKey) || 0) + sellOrder.amount);
					sellerFile.falcoins += sellOrder.price * sellOrder.amount;
					await database.market.subtractQuantityFromSellOrder(itemKey, sellOrder, sellOrder.amount);
					await database.market.addHistory(
						itemKey,
						instance.getMessage(interaction, 'HISTORY_BOUGHT', {
							PRICE: format(sellOrder.price * sellOrder.amount),
							AMOUNT: format(sellOrder.amount),
							ITEM: instance.getItemName(itemKey, interaction),
						})
					);
					sellerFile.stats.listingsSold += sellOrder.amount;
				} else {
					userFile.falcoins -= sellOrder.price * amount;
					totalPaid += sellOrder.price * amount;
					userFile.inventory.set(itemKey, (userFile.inventory.get(itemKey) || 0) + amount);
					sellerFile.falcoins += sellOrder.price * amount;
					await database.market.subtractQuantityFromSellOrder(itemKey, sellOrder, amount);
					sellerFile.stats.listingsSold += amount;
					amount = 0;
					await database.market.addHistory(
						itemKey,
						instance.getMessage(interaction, 'HISTORY_BOUGHT', {
							PRICE: format(sellOrder.price),
							AMOUNT: format(amount),
							ITEM: instance.getItemName(itemKey, interaction),
						})
					);
				}
				await sellerFile.save();
			}
			await userFile.save();

			const embed = instance.createEmbed(member.displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_BOUGHT', {
					AMOUNT: amountArgument - amount,
					ITEM: instance.getItemName(itemKey, interaction),
					PRICE: format(totalPaid),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'buy' && subcommandGroup == 'list') {
			const item = interaction.options.getString('item');
			const itemKey = getItem(item);
			const itemJSON = items[itemKey];
			const userFile = await database.player.findOne(member.id);

			try {
				var amount = await numerize(interaction.options.getString('amount'), Number.MAX_SAFE_INTEGER);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('amount'),
					}),
				});
			}

			try {
				var price = await numerize(interaction.options.getString('price'), Number.MAX_SAFE_INTEGER);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('price'),
					}),
				});
			}

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

			if (userFile.falcoins < price * amount) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_FALCOINS'),
				});
				return;
			}

			if (price < Math.floor(itemJSON.value * 1.2)) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'PRICE_TOO_LOW', {
						PRICE: format(Math.floor(itemJSON.value * 1.2)),
					}),
				});
				return;
			}

			userFile.falcoins -= price * amount;
			await userFile.save();
			const buyOrder = {
				price: price,
				amount: amount,
				owner: member.id,
			};
			await database.market.addBuyOrder(itemKey, buyOrder);

			const embed = instance.createEmbed(member.displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_LISTED_BUY', {
					AMOUNT: amount,
					ITEM: instance.getItemName(itemKey, interaction),
					PRICE: format(price),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'sell' && subcommandGroup == 'list') {
			const item = interaction.options.getString('item');
			const itemKey = getItem(item);
			const itemJSON = items[itemKey];
			const userFile = await database.player.findOne(member.id);

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

			try {
				var amount = await numerize(interaction.options.getString('amount'), userFile.inventory.get(itemKey));
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('amount'),
					}),
				});
			}

			if (userFile.inventory.get(itemKey) < amount) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_ITEMS', {
						ITEM: instance.getItemName(itemKey, interaction),
					}),
				});
				return;
			}

			try {
				var price = await numerize(interaction.options.getString('price'), Number.MAX_SAFE_INTEGER);
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('price'),
					}),
				});
			}

			if (price < Math.floor(itemJSON.value * 1.1)) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'PRICE_TOO_LOW', {
						PRICE: format(Math.floor(itemJSON.value * 1.1)),
					}),
				});
				return;
			}
			userFile.inventory.set(itemKey, userFile.inventory.get(itemKey) - amount);
			await userFile.save();
			const sellOrder = {
				price: price,
				amount: amount,
				owner: member.id,
			};
			await database.market.addSellOrder(itemKey, sellOrder);

			const embed = instance.createEmbed(member.displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_LISTED_SELL', {
					AMOUNT: amount,
					ITEM: instance.getItemName(itemKey, interaction),
					PRICE: format(price),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'listings') {
			const listings = interaction.options.getString('type');

			if (listings == 'buy') {
				const buyOrders = await database.market.getBuyOrdersFromUser(member.id);
				if (buyOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				const numberOfPages = Math.ceil(buyOrders.length / 25);
				const embeds = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const embed = instance.createEmbed(member.displayColor).setTitle(
							instance.getMessage(interaction, 'MARKET_BUY_LISTINGS', {
								PAGE: i + 1,
								TOTAL: numberOfPages,
							})
						);

						const ordersOnPage = buyOrders.slice(i * 25, (i + 1) * 25);
						for (var order of ordersOnPage) {
							embed.addFields({
								name: `${instance.getItemName(order.item, interaction)}`,
								value: `${format(order.price)} falcoins - ${format(order.amount)} ${instance.getMessage(
									interaction,
									'AVAILABLES'
								)}`,
								inline: false,
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
			} else if (listings == 'sell') {
				const sellOrders = await database.market.getSellOrdersFromUser(member.id);
				if (sellOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				const numberOfPages = Math.ceil(sellOrders.length / 25);
				const embeds = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const embed = instance.createEmbed(member.displayColor).setTitle(
							instance.getMessage(interaction, 'MARKET_SELL_LISTINGS', {
								PAGE: i + 1,
								TOTAL: numberOfPages,
							})
						);

						const ordersOnPage = sellOrders.slice(i * 25, (i + 1) * 25);
						for (var order of ordersOnPage) {
							embed.addFields({
								name: `${instance.getItemName(order.item, interaction)}`,
								value: `${format(order.price)} falcoins - ${format(order.amount)} ${instance.getMessage(
									interaction,
									'AVAILABLES'
								)}`,
								inline: false,
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
			}
		} else if (type == 'delist') {
			const listings = interaction.options.getString('type');
			const item = interaction.options.getString('item');
			const itemKey = getItem(item);
			const itemJSON = items[itemKey];
			const userFile = await database.player.findOne(member.id);

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

			if (listings == 'buy') {
				const buyOrders = await database.market.getBuyOrdersFromUser(member.id);
				if (buyOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				var index = buyOrders.findIndex((order) => order.item === itemKey && order.owner === member.id);
				if (index == -1) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'THIS_LISTING_DOESNT_EXIST'),
					});
					return;
				}

				const buyOrder = buyOrders[index];
				userFile.falcoins += buyOrder.price * buyOrder.amount;
				await userFile.save();
				await database.market.deleteBuyOrder(itemKey, buyOrder);

				const embed = instance.createEmbed(member.displayColor).setTitle(
					instance.getMessage(interaction, 'MARKET_DELISTED_BUY', {
						AMOUNT: buyOrder.amount,
						ITEM: instance.getItemName(itemKey, interaction),
						PRICE: format(buyOrder.price),
					})
				);

				instance.editReply(interaction, { embeds: [embed] });
			} else if (listings == 'sell') {
				const sellOrders = await database.market.getSellOrdersFromUser(member.id);
				if (sellOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				var index = sellOrders.findIndex((order) => order.item === itemKey && order.owner === member.id);
				if (index == -1) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'THIS_LISTING_DOESNT_EXIST'),
					});
					return;
				}

				const sellOrder = sellOrders[index];
				userFile.inventory.set(itemKey, (userFile.inventory.get(itemKey) || 0) + sellOrder.amount);
				await userFile.save();
				await database.market.deleteSellOrder(itemKey, sellOrder);

				const embed = instance.createEmbed(member.displayColor).setTitle(
					instance.getMessage(interaction, 'MARKET_DELISTED_SELL', {
						AMOUNT: sellOrder.amount,
						ITEM: instance.getItemName(itemKey, interaction),
						PRICE: format(sellOrder.price),
					})
				);

				instance.editReply(interaction, { embeds: [embed] });
			}
		} else if (type == 'history') {
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

			const history = await database.market.getHistory(itemKey);
			if (history.length == 0) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NO_HISTORY'),
				});
				return;
			}

			const numberOfPages = Math.ceil(history.length / 15);
			const embeds = await Promise.all(
				Array.from({ length: numberOfPages }).map(async (_, i) => {
					const embed = instance.createEmbed(member.displayColor);

					const historyOnPage = history.slice(i * 15, (i + 1) * 15);
					embed.addFields({
						name: instance.getMessage(interaction, 'MARKET_HISTORY', {
							ITEM: instance.getItemName(itemKey, interaction),
							PAGE: i + 1,
							TOTAL: numberOfPages,
						}),
						value: historyOnPage.join('\n'),
					});

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
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const { items } = instance;

		var localeItems = Object.keys(items)
			.map((key) => {
				const itemData = items[key];
				if (
					itemData.mythical !== true // Sellable items
				) {
					return instance.getItemName(key, interaction);
				}
				return undefined;
			})
			.filter((item) => item !== undefined);

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
