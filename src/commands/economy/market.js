const { format, paginate } = require('../../utils/functions.js');
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
						.setNameLocalizations({ 'pt-BR': 'quantidade', 'es-ES': 'cantidad' })
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
						.setDescription('List that you want to buy an item in the market')
						.setDescriptionLocalizations({
							'pt-BR': 'Anuncie que você quer comprar um item no mercado',
							'es-ES': 'Anuncie que quieres comprar un item en el mercado',
						})
						.addStringOption((option) =>
							option
								.setName('item')
								.setDescription('The item to be bought')
								.setDescriptionLocalizations({
									'pt-BR': 'O item que deseja comprar',
									'es-ES': 'El item que deseas comprar',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
						.addStringOption((option) =>
							option
								.setName('amount')
								.setNameLocalizations({ 'pt-BR': 'quantidade', 'es-ES': 'cantidad' })
								.setDescription('The amount of items you want to buy')
								.setDescriptionLocalizations({
									'pt-BR': 'A quantidade de itens que deseja comprar',
									'es-ES': 'La cantidad de items que deseas comprar',
								})
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName('price')
								.setNameLocalizations({ 'pt-BR': 'preço', 'es-ES': 'precio' })
								.setDescription('How much you want to pay for each item')
								.setDescriptionLocalizations({
									'pt-BR': 'Quanto deseja pagar por cada item individual',
									'es-ES': 'Cuánto deseas pagar por cada item individual',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('sell')
						.setNameLocalizations({ 'pt-BR': 'venda', 'es-ES': 'venda' })
						.setDescription('List that you want to sell an item in the market')
						.setDescriptionLocalizations({
							'pt-BR': 'Anuncie que você quer vender um item no mercado',
							'es-ES': 'Anuncie que quieres vender un item en el mercado',
						})
						.addStringOption((option) =>
							option
								.setName('item')
								.setDescription('The item to be sold')
								.setDescriptionLocalizations({
									'pt-BR': 'O item que deseja vender',
									'es-ES': 'El item que deseas vender',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
						.addStringOption((option) =>
							option
								.setName('amount')
								.setNameLocalizations({ 'pt-BR': 'quantidade', 'es-ES': 'cantidad' })
								.setDescription('The amount of items you want to sell')
								.setDescriptionLocalizations({
									'pt-BR': 'A quantidade de itens que deseja vender',
									'es-ES': 'La cantidad de items que deseas vender',
								})
								.setRequired(true)
						)
						.addStringOption((option) =>
							option
								.setName('price')
								.setNameLocalizations({ 'pt-BR': 'preço', 'es-ES': 'precio' })
								.setDescription('How much you want to sell each item for')
								.setDescriptionLocalizations({
									'pt-BR': 'Quanto deseja vender cada item individual',
									'es-ES': 'Cuánto deseas vender cada item individual',
								})
								.setRequired(true)
								.setAutocomplete(true)
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('listings')
				.setNameLocalizations({ 'pt-BR': 'anúncios', 'es-ES': 'anuncios' })
				.setDescription('View your listings')
				.setDescriptionLocalizations({ 'pt-BR': 'Veja seus anúncios', 'es-ES': 'Ver tus anuncios' })
				.addStringOption((option) =>
					option
						.setName('type')
						.setNameLocalizations({ 'pt-BR': 'tipo', 'es-ES': 'tipo' })
						.setDescription('The type of listings to view')
						.setDescriptionLocalizations({
							'pt-BR': 'O tipo de anúncios a serem vistos',
							'es-ES': 'El tipo de anuncios a ver',
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
		const { items, market } = instance;
		const displayColor = await instance.getUserDisplay('displayColor', member);

		if (type == 'all') {
			// pre calculate the sections of items
			const sellableItems = Array.from(items.sellableItems.values());
			const numberOfPages = Math.ceil(sellableItems.length / 15);
			const itemsOnPage = {};
			for (var i = 0; i < numberOfPages; i++) {
				itemsOnPage[i] = sellableItems.slice(i * 15, (i + 1) * 15);
			}

			//create an array of embeds, each embed containing 3 columns with 5 items each, until all items are displayed
			const embeds = await Promise.all(
				Array.from({ length: numberOfPages }).map(async (_, i) => {
					const embed = instance.createEmbed(displayColor).setTitle(
						instance.getMessage(interaction, 'MARKET_TITLE', {
							PAGE: i + 1,
							TOTAL: numberOfPages,
						})
					);

					for (var item of itemsOnPage[i]) {
						var cheapestSellOrder = await market.getCheapestSellOrder(item.id);
						embed.addFields({
							name: instance.getItemName(item.id, interaction),
							value:
								cheapestSellOrder == null
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
							label: instance.getItemName(item.id, interaction),
							value: item.id,
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
			var item = interaction.options ? interaction.options.getString('item') : interaction.values[0];
			const itemJSON = items.getItem(item);

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

			const embed = instance.createEmbed(displayColor).setTitle(instance.getItemName(itemJSON.id, interaction));

			//retrieve all buy orders and group them by price, putting the highest price first, and formatting the string like x falcoins - y availables
			const buyOrders = await market.getOrders(itemJSON.id, 'buy');
			if (buyOrders != []) {
				var groupedBuyOrders = {};
				buyOrders.forEach((order) => {
					if (groupedBuyOrders[order.price])
						groupedBuyOrders[order.price] = groupedBuyOrders[order.price] += order.amount;
					else groupedBuyOrders[order.price] = order.amount;
				});
				var formattedBuyOrders = Object.entries(groupedBuyOrders)
					.sort((a, b) => b[0] - a[0])
					.map(
						(order) =>
							`${instance.getItemEmoji(itemJSON.id)} **${format(Number(order[0]))} falcoins** - ${format(
								order[1]
							)} ${instance.getMessage(interaction, 'AVAILABLES')}`
					);
			}

			//retrieve all sell orders and group them by price, putting the lowest price first, and formatting the string like x falcoins (y orders)
			const sellOrders = await market.getOrders(itemJSON.id, 'sell');
			if (sellOrders != []) {
				var groupedSellOrders = {};
				sellOrders.forEach((order) => {
					if (groupedSellOrders[order.price])
						groupedSellOrders[order.price] = groupedSellOrders[order.price] + order.amount;
					else groupedSellOrders[order.price] = order.amount;
				});
				var formattedSellOrders = Object.entries(groupedSellOrders)
					.sort((a, b) => b[0] - a[0])
					.map(
						(order) =>
							`${instance.getItemEmoji(itemJSON.id)} **${format(Number(order[0]))} falcoins** - ${format(
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
			const itemJSON = items.getItem(item);
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
			while (amount > 0 && (await market.getCheapestSellOrder(itemJSON.id)) != null && userFile.falcoins > 0) {
				const sellOrder = await market.getCheapestSellOrder(itemJSON.id);
				const sellerFile = await database.player.findOne(sellOrder.owner);
				if (amount >= sellOrder.amount) {
					amount -= sellOrder.amount;
					userFile.falcoins -= sellOrder.price * sellOrder.amount;
					totalPaid += sellOrder.price * sellOrder.amount;
					userFile.inventory.set(itemJSON.id, (userFile.inventory.get(itemJSON.id) || 0) + sellOrder.amount);
					sellerFile.falcoins += sellOrder.price * sellOrder.amount;
					await market.subtractQuantityFromOrder(itemJSON.id, sellOrder, sellOrder.amount, 'sell');
					await market.addHistory(itemJSON.id, {
						price: format(sellOrder.price * sellOrder.amount),
						amount: format(sellOrder.amount),
						item: itemJSON.id,
					});
					sellerFile.stats.listingsSold += sellOrder.amount;
				} else {
					userFile.falcoins -= sellOrder.price * amount;
					totalPaid += sellOrder.price * amount;
					userFile.inventory.set(itemJSON.id, (userFile.inventory.get(itemJSON.id) || 0) + amount);
					sellerFile.falcoins += sellOrder.price * amount;
					await market.subtractQuantityFromOrder(itemJSON.id, sellOrder, amount, 'sell');
					sellerFile.stats.listingsSold += amount;
					await market.addHistory(itemJSON.id, {
						price: format(sellOrder.price),
						amount: format(amount),
						item: itemJSON.id,
					});
					amount = 0;
				}
				await sellerFile.save();
			}
			await userFile.save();

			const embed = instance.createEmbed(displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_BOUGHT', {
					AMOUNT: amountArgument - amount,
					ITEM: instance.getItemName(itemJSON.id, interaction),
					PRICE: format(totalPaid),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'buy' && subcommandGroup == 'list') {
			const item = interaction.options.getString('item');
			const itemJSON = items.getItem(item);
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
			await market.addOrder(itemJSON.id, buyOrder, 'buy');

			const embed = instance.createEmbed(displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_LISTED_BUY', {
					AMOUNT: amount,
					ITEM: instance.getItemName(itemJSON.id, interaction),
					PRICE: format(price),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'sell' && subcommandGroup == 'list') {
			const item = interaction.options.getString('item');
			const itemJSON = items.getItem(item);
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
				var amount = await numerize(interaction.options.getString('amount'), userFile.inventory.get(itemJSON.id));
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: interaction.options.getString('amount'),
					}),
				});
			}

			if (userFile.inventory.get(itemJSON.id) < amount) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NOT_ENOUGH_ITEMS', {
						ITEM: instance.getItemName(itemJSON.id, interaction),
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
			userFile.inventory.set(itemJSON.id, userFile.inventory.get(itemJSON.id) - amount);
			await userFile.save();
			const sellOrder = {
				price: price,
				amount: amount,
				owner: member.id,
			};
			await market.addOrder(itemJSON.id, sellOrder, 'sell');

			const embed = instance.createEmbed(displayColor).setTitle(
				instance.getMessage(interaction, 'MARKET_LISTED_SELL', {
					AMOUNT: amount,
					ITEM: instance.getItemName(itemJSON.id, interaction),
					PRICE: format(price),
				})
			);

			instance.editReply(interaction, { embeds: [embed] });
		} else if (type == 'listings') {
			const listings = interaction.options.getString('type');

			if (listings == 'buy') {
				const buyOrders = await market.getOrdersFromUser(member.id, 'buy');
				if (buyOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				const numberOfPages = Math.ceil(buyOrders.length / 25);
				const embeds = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const embed = instance.createEmbed(displayColor).setTitle(
							instance.getMessage(interaction, 'MARKET_BUY_LISTINGS', {
								PAGE: i + 1,
								TOTAL: numberOfPages,
							})
						);

						const ordersOnPage = buyOrders.slice(i * 25, (i + 1) * 25);
						for (var o of ordersOnPage) {
							const { _id, order } = o;
							embed.addFields({
								name: `${instance.getItemName(_id, interaction)}`,
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

				//create a select menu with the items on that page
				const selectMenus = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const options = buyOrders.slice(i * 25, (i + 1) * 25).map((o) => {
							const { _id, order } = o;
							return {
								label: instance.getItemName(_id, interaction),
								value: `${_id}__${order.amount}__${order.price}`,
							};
						});
						const select = new StringSelectMenuBuilder()
							.setCustomId(`${i}`)
							.setPlaceholder(instance.getMessage(interaction, 'LISTING_REMOVE'))
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

				message.createMessageComponentCollector().on('collect', async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back();
						await i.update(paginator.components());
					} else if (i.customId === ids[1]) {
						await paginator.next();
						await i.update(paginator.components());
					} else if (i.values[0].includes('__')) {
						const [item, amount, price] = i.values[0].split('__');
						const itemJSON = items.getItem(item);
						const userFile = await database.player.findOne(member.id);
						userFile.inventory.set(itemJSON.id, (userFile.inventory.get(itemJSON.id) || 0) + Number(amount));
						await userFile.save();
						await market.removeOrder(itemJSON.id, { owner: member.id, amount, price }, 'buy');
						await i.reply({
							content: instance.getMessage(interaction, 'MARKET_DELISTED_BUY', {
								AMOUNT: format(Number(amount)),
								ITEM: instance.getItemName(itemJSON.id, interaction),
								PRICE: format(Number(price)),
							}),
						});
					}
				});
			} else if (listings == 'sell') {
				const sellOrders = await market.getOrdersFromUser(member.id, 'sell');
				if (sellOrders.length == 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'YOU_DONT_HAVE_LISTINGS'),
					});
					return;
				}

				const numberOfPages = Math.ceil(sellOrders.length / 25);
				const embeds = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const embed = instance.createEmbed(displayColor).setTitle(
							instance.getMessage(interaction, 'MARKET_SELL_LISTINGS', {
								PAGE: i + 1,
								TOTAL: numberOfPages,
							})
						);

						const ordersOnPage = sellOrders.slice(i * 25, (i + 1) * 25);
						for (var o of ordersOnPage) {
							const { _id, order } = o;
							embed.addFields({
								name: `${instance.getItemName(_id, interaction)}`,
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

				//create a select menu with the items on that page
				const selectMenus = await Promise.all(
					Array.from({ length: numberOfPages }).map(async (_, i) => {
						const options = sellOrders.slice(i * 25, (i + 1) * 25).map((o) => {
							const { _id, order } = o;
							return {
								label: instance.getItemName(_id, interaction),
								value: `${_id}__${order.amount}__${order.price}`,
							};
						});
						const select = new StringSelectMenuBuilder()
							.setCustomId(`${i}`)
							.setPlaceholder(instance.getMessage(interaction, 'LISTING_REMOVE'))
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

				message.createMessageComponentCollector().on('collect', async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back();
						await i.update(paginator.components());
					} else if (i.customId === ids[1]) {
						await paginator.next();
						await i.update(paginator.components());
					} else if (i.values[0].includes('__')) {
						const [item, amount, price] = i.values[0].split('__');
						const itemJSON = items.getItem(item);
						const userFile = await database.player.findOne(member.id);
						userFile.inventory.set(itemJSON.id, (userFile.inventory.get(itemJSON.id) || 0) + Number(amount));
						await userFile.save();
						await market.removeOrder(itemJSON.id, { owner: member.id, amount, price }, 'sell');
						await i.reply({
							content: instance.getMessage(interaction, 'MARKET_DELISTED_SELL', {
								AMOUNT: amount,
								ITEM: instance.getItemName(itemJSON.id, interaction),
								PRICE: format(price),
							}),
						});
					}
				});
			}
		} else if (type == 'history') {
			const item = interaction.options.getString('item');
			const itemJSON = items.getItem(item);

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

			const history = await market.getHistory(itemJSON.id);
			if (history.length == 0) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'NO_HISTORY'),
				});
				return;
			}

			const numberOfPages = Math.ceil(history.length / 15);
			const embeds = await Promise.all(
				Array.from({ length: numberOfPages }).map(async (_, i) => {
					const embed = instance.createEmbed(displayColor);

					const historyOnPage = history.slice(i * 15, (i + 1) * 15);
					var formattedHistory = historyOnPage.map((entry) =>
						instance.getMessage(interaction, 'HISTORY_BOUGHT', {
							PRICE: entry.price,
							AMOUNT: entry.amount,
							ITEM: instance.getItemName(entry.item, interaction),
						})
					);

					embed.addFields({
						name: instance.getMessage(interaction, 'MARKET_HISTORY', {
							ITEM: instance.getItemName(itemJSON.id, interaction),
							PAGE: i + 1,
							TOTAL: numberOfPages,
						}),
						value: formattedHistory.join('\n'),
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
		const option = interaction.options.getFocused(true).name;
		const { items } = instance;

		if (option == 'item') {
			var localeItems = Array.from(items.sellableItems.keys()).map((key) => instance.getItemName(key, interaction));

			const filtered = localeItems.filter((choice) => {
				const lowerCaseChoice = choice.toLowerCase();
				return (
					lowerCaseChoice.startsWith(focusedValue) ||
					lowerCaseChoice.split(' ').slice(1).join(' ').startsWith(focusedValue)
				);
			});

			await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
		} else if (option == 'price') {
			const minimumPrice = items.getItem(interaction.options.getString('item')).value * 1.2;

			await interaction.respond([
				{
					name: instance.getMessage(interaction, 'PRICE_TOO_LOW', {
						PRICE: format(minimumPrice),
					}),
					value: `${minimumPrice}`,
				},
			]);
		}
	},
};
