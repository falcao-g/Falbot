const { format, paginate, getItem, buttons, isEquipped, specialArg } = require('../../utils/functions.js');
const { ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setNameLocalizations({
			'pt-BR': 'inventário',
			'es-ES': 'inventario',
		})
		.setDescription('Inventory actions')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalizations({
					'pt-BR': 'ver',
					'es-ES': 'ver',
				})
				.setDescription('View your inventory or of another user')
				.setDescriptionLocalizations({
					'pt-BR': 'Veja o seu inventário ou o de outro usuário',
					'es-ES': 'Ver tu inventario o el de otro usuario',
				})
				.addUserOption((option) =>
					option
						.setName('user')
						.setNameLocalizations({
							'pt-BR': 'usuário',
							'es-ES': 'usuario',
						})
						.setDescription('the user you want to see the inventory, leave blank to get your inventory')
						.setDescriptionLocalizations({
							'pt-BR': 'o usuário que você deseja ver o inventário, deixe vazio para ver o seu',
							'es-ES': 'el usuario que quieres ver el inventario, deja en blanco para ver el tuyo',
						})
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('calc')
				.setNameLocalizations({
					'pt-BR': 'calcular',
					'es-ES': 'calcular',
				})
				.setDescription('Calculate crafting materials or items cost')
				.setDescriptionLocalizations({
					'pt-BR': 'Calcule materiais e custo para construção',
					'es-ES': 'Calcular los materiales y el coste de la construcción',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to calculate')
						.setDescriptionLocalizations({
							'pt-BR': 'item para calcular',
							'es-ES': 'item para calcular',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalizations({
							'pt-BR': 'quantidade',
							'es-ES': 'cantidad',
						})
						.setDescription('amount of the item')
						.setDescriptionLocalizations({
							'pt-BR': 'quantidade do item',
							'es-ES': 'cantidad del item',
						})
						.setRequired(true)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sell')
				.setNameLocalizations({
					'pt-BR': 'vender',
					'es-ES': 'vender',
				})
				.setDescription('Sell items to the market')
				.setDescriptionLocalizations({
					'pt-BR': 'Venda itens para o mercado',
					'es-ES': 'Vender items para el mercado',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to sell')
						.setDescriptionLocalizations({
							'pt-BR': 'item para vender',
							'es-ES': 'item para vender',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption((option) =>
					option
						.setName('amount')
						.setNameLocalizations({
							'pt-BR': 'quantidade',
							'es-ES': 'cantidad',
						})
						.setDescription('amount of the item')
						.setDescriptionLocalizations({
							'pt-BR': 'quantidade do item (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)',
							'es-ES': 'cantidad del item (admite "todo"/"mitad" y notas como 50.000, 20%, 10M, 25B)',
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('equip')
				.setNameLocalizations({
					'pt-BR': 'equipar',
					'es-ES': 'equipar',
				})
				.setDescription('Equip an item or leave blank to see equippable items')
				.setDescriptionLocalizations({
					'pt-BR': 'Equipe um item ou deixe vazio para ver os itens equipáveis',
					'es-ES': 'Equipe un item o deja en blanco para ver los items equipables',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to equip')
						.setDescriptionLocalizations({
							'pt-BR': 'item para equipar',
							'es-ES': 'item para equipar',
						})
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('craft')
				.setNameLocalizations({
					'pt-BR': 'construir',
					'es-ES': 'construir',
				})
				.setDescription('Craft an item')
				.setDescriptionLocalizations({
					'pt-BR': 'Construa um item',
					'es-ES': 'Construir un item',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to craft')
						.setDescriptionLocalizations({
							'pt-BR': 'item para construir',
							'es-ES': 'item para construir',
						})
						.setRequired(false)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalizations({
							'pt-BR': 'quantidade',
							'es-ES': 'cantidad',
						})
						.setDescription('amount of the item')
						.setDescriptionLocalizations({
							'pt-BR': 'quantidade do item',
							'es-ES': 'cantidad del item',
						})
						.setRequired(false)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sellall')
				.setNameLocalizations({
					'pt-BR': 'vendertudo',
					'es-ES': 'vendertudo',
				})
				.setDescription('Sell (almost) entire inventory to bot')
				.setDescriptionLocalizations({
					'pt-BR': 'Venda (quase) todo o inventário para o bot',
					'es-ES': 'Vender (casi) todo el inventario para el bot',
				})
				.addStringOption((option) =>
					option
						.setName('lootonly')
						.setNameLocalizations({
							'pt-BR': 'somente-loot',
							'es-ES': 'solo-loot',
						})
						.setDescription('sell only loot items')
						.setDescriptionLocalizations({
							'pt-BR': 'venda apenas itens de loot',
							'es-ES': 'vender solo items de loot',
						})
						.setRequired(false)
						.addChoices(
							{
								name: 'yes',
								name_localizations: { 'pt-BR': 'sim', 'es-ES': 'sí' },
								value: 'yes',
							},
							{
								name: 'no',
								name_localizations: { 'pt-BR': 'não', 'es-ES': 'no' },
								value: 'no',
							}
						)
				)
				.addStringOption((option) =>
					option
						.setName('no-legendary')
						.setNameLocalizations({
							'pt-BR': 'sem-lendários',
							'es-ES': 'sin-legendarios',
						})
						.setDescription('sell only non-legendary items')
						.setDescriptionLocalizations({
							'pt-BR': 'venda apenas itens não-lendários',
							'es-ES': 'vender solo items no-legendarios',
						})
						.setRequired(false)
						.addChoices(
							{
								name: 'yes',
								name_localizations: { 'pt-BR': 'sim', 'es-ES': 'sí' },
								value: 'yes',
							},
							{
								name: 'no',
								name_localizations: { 'pt-BR': 'não', 'es-ES': 'no' },
								value: 'no',
							}
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sort')
				.setNameLocalizations({
					'pt-BR': 'ordenação',
					'es-ES': 'ordenación',
				})
				.setDescription('Change inventory sorting method')
				.setDescriptionLocalizations({
					'pt-BR': 'Mude o método de ordenação do inventário',
					'es-ES': 'Cambiar el método de ordenación del inventario',
				})
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('use')
				.setNameLocalizations({
					'pt-BR': 'usar',
					'es-ES': 'usar',
				})
				.setDescription('Use an item')
				.setDescriptionLocalizations({
					'pt-BR': 'Use um item',
					'es-ES': 'Usar un item',
				})
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to use')
						.setDescriptionLocalizations({
							'pt-BR': 'item para usar',
							'es-ES': 'item para usar',
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
			const { items } = instance;

			if (type === 'view') {
				if (subcommand != 'view') {
					var option = interaction.options.getUser('user');
				}

				const target = option ? await guild.members.fetch(option.id) : member;
				const player = await database.player.findOne(target.id);
				const limit = instance.levels[player.rank - 1].inventoryLimit + player.inventoryBonus;
				const { inventoryWorth } = instance.getInventoryInfo(player.inventory);

				if (player.inventory === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEMS'),
					});
					return;
				}

				// Create an array of inventory items with their quantity as a string
				const inventoryItems = Array.from(player.inventory)
					.reduce((acc, [itemName, quantity]) => {
						if (quantity !== 0) {
							acc.push(`${instance.getItemName(itemName, interaction)} x ${quantity}`);
						}
						return acc;
					}, [])
					.sort((a, b) => {
						switch (player.inventorySort) {
							case 'itemValue':
								return (
									items[getItem(a.split(' ').slice(1, -2).join(' '))].value -
									items[getItem(b.split(' ').slice(1, -2).join(' '))].value
								);
							case 'quantity':
								return a.split(' ')[-1] - b.split(' ')[-1];
							case 'worth':
								return (
									items[getItem(a.split(' ').slice(1, -2).join(' '))].value * a.split(' x ')[1] -
									items[getItem(b.split(' ').slice(1, -2).join(' '))].value * b.split(' x ')[1]
								);
							default:
								return a.split(' ').slice(1, -2).join(' ').localeCompare(b.split(' ').slice(1, -2).join(' '));
						}
					});
				// Calculate the number of required embeds based on the number of inventory items
				const numEmbeds = Math.ceil(inventoryItems.length / 24) || 1;

				// Create an array of embeds, each with up to 24 items split across three fields
				const embeds = [];
				for (let i = 0; i < numEmbeds; i++) {
					const startIndex = i * 24;
					const itemsChunk = inventoryItems.slice(startIndex, startIndex + 24);

					const embed = instance.createEmbed(member.displayColor).setTitle(
						instance.getMessage(interaction, 'INVENTORY_TITLE', {
							MEMBER: target.displayName,
							NUMBER: i + 1,
							TOTAL: numEmbeds,
							WORTH: format(inventoryWorth),
							LIMIT: format(limit),
						})
					);

					for (let j = 0; j < itemsChunk.length; j += 8) {
						const itemsChunkSubset = itemsChunk.slice(j, j + 8);
						embed.addFields({
							name: 'Items',
							value: itemsChunkSubset.join('\n'),
							inline: true,
						});
					}

					embeds.push(embed);
				}

				const paginator = paginate();
				paginator.add(...embeds);
				const ids = [`${Date.now()}__left`, `${Date.now()}__right`];
				paginator.setTraverser([
					new ButtonBuilder().setEmoji('⬅️').setCustomId(ids[0]).setStyle('Secondary'),
					new ButtonBuilder().setEmoji('➡️').setCustomId(ids[1]).setStyle('Secondary'),
					new ButtonBuilder()
						.setEmoji('⚒')
						.setCustomId('inventory craft')
						.setStyle('Secondary')
						.setLabel(instance.getMessage(interaction, 'CRAFT')),
					new ButtonBuilder()
						.setEmoji('⚙️')
						.setCustomId('inventory sort')
						.setStyle('Secondary')
						.setLabel(instance.getMessage(interaction, 'INVENTORY_SORTING')),
					new ButtonBuilder()
						.setEmoji('🛒')
						.setCustomId('market all')
						.setStyle('Secondary')
						.setLabel(instance.getMessage(interaction, 'MARKET')),
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
				player.save();
			} else if (type === 'calc') {
				const amount = interaction.options.getInteger('amount');
				const itemKey = getItem(interaction.options.getString('item'));
				const itemJSON = items[itemKey];
				var cost = 0;

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: item,
						}),
					});
					return;
				}

				if (itemJSON.recipe != undefined) {
					var ingredients = `**${instance.getMessage(interaction, 'INGREDIENTS')}**`;

					for (key in itemJSON.recipe) {
						ingredients += `\n${instance.getItemName(key, interaction)} x ${itemJSON.recipe[key] * amount}`;
						cost += items[key].value * itemJSON.recipe[key] * amount;
					}
				} else {
					cost = itemJSON.value * amount;
				}

				const embed = instance
					.createEmbed(member.displayColor)
					.setTitle(instance.getMessage(interaction, 'CALCULATOR'))
					.addFields({
						name: `${instance.getItemName(itemKey, interaction)} x ${amount}`,
						value: `${ingredients != undefined ? ingredients : ''}\n${instance.getMessage(
							interaction,
							'COST'
						)} **${format(cost)} falcoins**`,
					});

				instance.editReply(interaction, {
					embeds: [embed],
				});
			} else if (type === 'sell') {
				const player = await database.player.findOne(member.id);
				const itemKey = getItem(interaction.options.getString('item'));
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

				if (player.inventory.get(itemKey) === 0 || player.inventory.get(itemKey) === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}
				try {
					var amount = Math.min(
						player.inventory.get(itemKey),
						specialArg(interaction.options.getString('amount'), player.inventory.get(itemKey))
					);
				} catch {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: interaction.options.getString('amount'),
						}),
					});
					return;
				}

				//we need to check if there is someone in the market that wants to buy the item
				let falcoins = 0;
				let amountToSell = amount;
				while (amountToSell > 0 && (await database.market.getBestBuyOrder(itemKey)).price > 0) {
					const buyOrder = await database.market.getBestBuyOrder(itemKey);
					const buyerFile = await database.player.findOne(buyOrder.owner);

					if (amount >= buyOrder.amount) {
						amountToSell -= buyOrder.amount;
						amountSold = buyOrder.amount;
					} else {
						amountToSell = 0;
						amountSold = amount;
					}

					buyerFile.falcoins -= buyOrder.price * amount;
					buyerFile.inventory.set(itemKey, (buyerFile.inventory.get(itemKey) || 0) + amount);
					falcoins += buyOrder.price * amountSold;
					await database.market.subtractQuantityFromBuyOrder(itemKey, buyOrder, amount);
					await buyerFile.save();
					await database.market.addHistory(
						itemKey,
						instance.getMessage(interaction, 'HISTORY_SOLD', {
							PRICE: format(buyOrder.price * amountSold),
							AMOUNT: format(amountSold),
							ITEM: instance.getItemName(itemKey, interaction),
						})
					);
				}

				// if there is no one in the market that wants to buy the item, we sell it to the bot
				if (amountToSell > 0) falcoins += itemJSON.value * amountToSell;

				player.inventory.set(itemKey, player.inventory.get(itemKey) - amount);
				player.falcoins += falcoins;

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'SOLD_TITLE', {
						AMOUNT: format(amount),
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
						FALCOINS: format(falcoins),
					}),
					value: instance.getMessage(interaction, 'SOLD_FIELD', {
						REMAINING: format(player.inventory.get(itemKey)),
						FALCOINS2: format(Number(falcoins / amount)),
					}),
				});

				instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['inventory_view', 'balance'])],
				});
				player.save();
			} else if (type === 'equip') {
				const player = await database.player.findOne(member.id);
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

				if (itemJSON.equip != true) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'CANT_EQUIP'),
					});
					return;
				}

				if (player.inventory.get(itemKey) === 0 || player.inventory.get(itemKey) === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}

				if (await isEquipped(member, itemKey)) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'ALREADY_EQUIPPED'),
					});
					return;
				}

				player.equippedItems.push({ name: itemKey, usageCount: 3 });
				player.inventory.set(itemKey, player.inventory.get(itemKey) - 1);

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'EQUIPPED_TITLE', {
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
					}),
					value: instance.getMessage(interaction, 'EQUIPPED_VALUE', {
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
					}),
				});

				instance.editReply(interaction, {
					embeds: [embed],
				});
				player.save();
			} else if (type === 'craft') {
				const player = await database.player.findOne(member.id);
				if (interaction.options !== undefined) {
					var item = interaction.options.getString('item');
					var amount = interaction.options.getInteger('amount') || 1;
				} else {
					if (interaction.values !== undefined) {
						var item = interaction.values[0];
						var amount = 1;
					} else {
						var item = args[1];
						var amount = Number(args[0]);
					}
				}

				//the bot sends a string select menu containing all items that can be crafted
				if (!item) {
					const canBeCrafted = Object.keys(items)
						.map((item) => {
							if (items[item].recipe === undefined) return;

							for (key in items[item].recipe) {
								if ((player.inventory.get(key) || 0) < items[item].recipe[key]) return;
							}

							return {
								label: items[item][interaction.locale] ?? items[item]['en-US'],
								value: item,
								emoji: instance.getItemEmoji(item),
							};
						})
						.filter((item) => item !== undefined);

					if (canBeCrafted.length === 0) {
						instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'NO_CRAFT_AVAILABLE'),
						});
						return;
					}

					const row = new ActionRowBuilder().addComponents([
						new StringSelectMenuBuilder()
							.setCustomId('inventory craft')
							.setPlaceholder(instance.getMessage(interaction, 'CRAFT_PLACEHOLDER'))
							.addOptions(canBeCrafted.length > 25 ? canBeCrafted.slice(0, 25) : canBeCrafted),
					]);

					const embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'CRAFT_TITLE'),
						value: instance.getMessage(interaction, 'CRAFT_VALUE'),
					});

					instance.editReply(interaction, {
						components: [row],
						embeds: [embed],
					});
					return;
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

				if (itemJSON.recipe === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'CANT_CRAFT'),
					});
					return;
				}

				ingredients = [];
				missingIngredients = [];
				for (key in itemJSON.recipe) {
					const ingredientAmount = itemJSON.recipe[key] * amount;

					if ((player.inventory.get(key) || 0) < ingredientAmount) {
						missingIngredients.push(
							`${instance.getItemName(key, interaction)} x ${format(
								ingredientAmount - (player.inventory.get(key) || 0)
							)}`
						);
					}

					player.inventory.set(key, player.inventory.get(key) - ingredientAmount);
					ingredients.push(`${instance.getItemName(key, interaction)}: ${format(ingredientAmount)}`);
				}

				if (missingIngredients.length > 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'MISSING_INGREDIENTS', {
							ITEMS: missingIngredients.join(', '),
						}),
					});
					return;
				}

				//get how many more of that item you could make with the ingredients you have
				const maxAmount = Math.min(
					...Object.keys(itemJSON.recipe).map((key) => {
						return Math.floor(player.inventory.get(key) / itemJSON.recipe[key]);
					})
				);

				if (player.inventory.get(itemKey) === undefined) {
					player.inventory.set(itemKey, 0);
				}

				player.inventory.set(itemKey, player.inventory.get(itemKey) + amount);

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'CRAFTED_TITLE', {
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
						AMOUNT: format(amount),
					}),
					value: instance.getMessage(interaction, 'CRAFTED_VALUE', {
						INGREDIENTS: ingredients.join('\n'),
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
						AMOUNT: format(amount),
						MAXAMOUNT: format(maxAmount),
					}),
				});

				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setCustomId(`inventory craft 1 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 1')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`inventory craft 10 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 10')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`inventory craft 100 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 100')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`inventory craft ${maxAmount} ${itemKey} max`)
						.setLabel(instance.getMessage(interaction, 'CRAFT_MAX'))
						.setStyle('Secondary'),
				]);

				instance.editReply(interaction, {
					embeds: [embed],
					components: [row],
				});

				player.stats.itemsCrafted += amount;
				player.save();
			} else if (type === 'sellall') {
				const player = await database.player.findOne(member.id);
				var sellAllText = instance.getMessage(interaction, 'SELLALL_VALUE');

				const lootonly = interaction.options.getString('lootonly');
				const noLegendary = interaction.options.getString('no-legendary');

				if (noLegendary === 'yes') sellAllText += instance.getMessage(interaction, 'SELLALL_NOLEGENDARY');
				if (lootonly === 'yes') sellAllText += instance.getMessage(interaction, 'SELLALL_LOOTONLY');

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'SELLALL_TITLE'),
					value: sellAllText,
				});

				var answer = await instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['accept'])],
					fetchReply: true,
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member.id;
				};

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 300,
					max: 1,
				});

				collector.on('collect', async (i) => {
					var itemsSold = [];
					let falcoins = 0;

					for (key of player.inventory.keys()) {
						const itemJSON = items[key];

						if (lootonly === 'yes') {
							if (
								itemJSON.hunting === undefined &&
								itemJSON.fishing === undefined &&
								itemJSON.exploring === undefined &&
								itemJSON.mining === undefined
							) {
								continue;
							}
						}

						if (itemJSON.mythical || player.inventory.get(key) === 0) {
							continue;
						}

						if (noLegendary === 'yes' && itemJSON.rarity === 'Legendary') {
							continue;
						}

						// sell to the market if applicable
						let amountToSell = player.inventory.get(key);
						if (amountToSell > 0 && (await database.market.getBestBuyOrder(key)).price > 0) {
							const buyOrder = await database.market.getBestBuyOrder(key);
							const buyerFile = await database.player.findOne(buyOrder.owner);

							if (amountToSell >= buyOrder.amount) {
								amountToSell -= buyOrder.amount;
								amountSold = buyOrder.amount;
							} else {
								amountSold = amountToSell;
								amountToSell = 0;
							}

							buyerFile.falcoins -= buyOrder.price * amountSold;
							buyerFile.inventory.set(key, (buyerFile.inventory.get(key) || 0) + amountSold);
							falcoins += buyOrder.price * amountSold;
							await database.market.subtractQuantityFromBuyOrder(key, buyOrder, amountSold);
							await buyerFile.save();
							itemsSold.push(`${instance.getItemName(key, interaction)}: ${format(amountSold)}`);
							await database.market.addHistory(
								key,
								instance.getMessage(interaction, 'HISTORY_SOLD', {
									PRICE: format(buyOrder.price * amountSold),
									AMOUNT: format(amountSold),
									ITEM: instance.getItemName(key, interaction),
								})
							);
							continue;
						}

						// otherwise sell to the bot
						falcoins += itemJSON.value * player.inventory.get(key);
						itemsSold.push(`${instance.getItemName(key, interaction)}: ${format(player.inventory.get(key))}`);
						player.inventory.set(key, 0);
					}
					player.falcoins += falcoins;

					if (itemsSold.length > 10) {
						var { length } = itemsSold;
						itemsSold = itemsSold.splice(0, 10);
						itemsSold.push(
							instance.getMessage(interaction, 'MORE', {
								AMOUNT: format(length - 10),
							})
						);
					}

					const embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'SELLALL_CONFIRMED_TITLE'),
						value: instance.getMessage(interaction, 'SELLALL_CONFIRMED_VALUE', {
							ITEMS: itemsSold.join('\n'),
							FALCOINS: format(falcoins),
						}),
					});

					i.update({
						embeds: [embed],
						components: [],
					});
					player.save();
				});
			} else if (type === 'sort') {
				if (interaction.values === undefined) {
					const embed = instance.createEmbed(member.displayColor).addFields({
						name: ':gear: ' + instance.getMessage(interaction, 'INVENTORY_SORTING'),
						value: ':dvd: ' + instance.getMessage(interaction, 'SORTING_MENU'),
					});

					const row = new ActionRowBuilder().addComponents([
						new StringSelectMenuBuilder()
							.setCustomId('inventory sort')
							.setPlaceholder(instance.getMessage(interaction, 'SORTING_PLACEHOLDER'))
							.addOptions([
								{
									label: instance.getMessage(interaction, 'ITEMVALUE'),
									value: 'itemValue',
									emoji: '💸',
								},
								{
									label: instance.getMessage(interaction, 'QUANTITY'),
									value: 'quantity',
									emoji: '📶',
								},
								{
									label: instance.getMessage(interaction, 'WORTH'),
									value: 'worth',
									emoji: '💰',
								},
								{
									label: instance.getMessage(interaction, 'ALPHABETICAL'),
									value: 'alphabetical',
									emoji: '🅰️',
								},
							]),
					]);

					await instance.editReply(interaction, {
						components: [row],
						embeds: [embed],
					});
				} else {
					const sort = interaction.values[0];
					player.inventorySort = sort;

					const embed = instance.createEmbed(member.displayColor).addFields({
						name: ':gear: ' + instance.getMessage(interaction, 'INVENTORY_SORTING'),
						value:
							':dvd: ' +
							instance.getMessage(interaction, 'SORTING_NOW', {
								SORTING: instance.getMessage(interaction, sort.toUpperCase()),
							}),
					});

					await instance.editReply(interaction, {
						components: [buttons(['inventory_view'])],
						embeds: [embed],
					});
				}
			} else if (type === 'use') {
				const player = await database.player.findOne(member.id);
				const item = interaction.options.getString('item');
				const itemKey = getItem(item);
				const itemJSON = items[itemKey];

				if (itemKey === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'BAD_VALUE', {
							VALUE: item,
						}),
					});
					return;
				}

				if (player.inventory.get(itemKey) === undefined || player.inventory.get(itemKey) === 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}

				if (itemJSON.use != true) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'CANT_USE'),
					});
					return;
				}

				player.inventory.set(itemKey, player.inventory.get(itemKey) - 1);

				if (itemKey === 'backpack') {
					player.inventoryBonus += 200000;

					var embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'USE_BACKPACK_TITLE'),
						value: instance.getMessage(interaction, 'USE_BACKPACK_VALUE'),
					});
				} else if (itemKey === 'snowflake') {
					//reset all cooldowns
					player.cooldowns = {
						work: 0,
						hunt: 0,
						explore: 0,
						mine: 0,
						fish: 0,
						scratch: 0,
					};

					var embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'USE_MYTHICAL_TITLE'),
						value: instance.getMessage(interaction, 'USE_SNOWFLAKE_VALUE'),
					});
				}
				instance.editReply(interaction, {
					embeds: [embed],
				});
				player.save();
			}
		} catch (err) {
			console.error(`inventory: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const { items } = instance;
		const subcommand = interaction.options.getSubcommand();

		var localeItems = Object.keys(items)
			.map((key) => {
				const itemData = items[key];
				if (
					(subcommand === 'equip' && itemData.equip === true) || // Equipable items
					(subcommand === 'craft' && itemData.recipe !== undefined) || // Craftable items
					(subcommand === 'use' && itemData.use !== undefined) || // Usable items
					(subcommand === 'sell' && itemData.mythical !== true) || // Sellable items
					subcommand === 'calc' // All items
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
