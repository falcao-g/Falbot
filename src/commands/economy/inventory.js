const { readFile, format, paginate, getItem, changeDB, buttons, isEquipped } = require('../../utils/functions.js');
const { ButtonBuilder, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setNameLocalization('pt-BR', 'inventário')
		.setDescription('Inventory actions')
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setNameLocalization('pt-BR', 'ver')
				.setDescription('View your inventory or of another user')
				.setDescriptionLocalization('pt-BR', 'Veja o seu inventário ou o de outro usuário')
				.addUserOption((option) =>
					option
						.setName('user')
						.setNameLocalization('pt-BR', 'usuário')
						.setDescription('the user you want to see the inventory, leave blank to get your inventory')
						.setDescriptionLocalization(
							'pt-BR',
							'o usuário que você deseja ver o inventário, deixe vazio para ver o seu'
						)
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('calc')
				.setNameLocalization('pt-BR', 'calcular')
				.setDescription('Calculate crafting materials or items cost')
				.setDescriptionLocalization('pt-BR', 'Calcule materias e custo para construção')
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to calculate')
						.setDescriptionLocalization('pt-BR', 'item para calcular')
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalization('pt-BR', 'quantidade')
						.setDescription('amount of the item')
						.setDescriptionLocalization('pt-BR', 'quantidade do item')
						.setRequired(true)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sell')
				.setNameLocalization('pt-BR', 'vender')
				.setDescription('Sell items to the market')
				.setDescriptionLocalization('pt-BR', 'Vende items para o mercado')
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to sell')
						.setDescriptionLocalization('pt-BR', 'item para vender')
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalization('pt-BR', 'quantidade')
						.setDescription('amount of the item')
						.setDescriptionLocalization('pt-BR', 'quantidade do item')
						.setRequired(true)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('equip')
				.setNameLocalization('pt-BR', 'equipar')
				.setDescription('Equip an item or leave blank to see equippable items')
				.setDescriptionLocalization('pt-BR', 'Equipe um item ou deixe vazio para ver os itens equipáveis')
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to equip')
						.setDescriptionLocalization('pt-BR', 'item para equipar')
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('craft')
				.setNameLocalization('pt-BR', 'construir')
				.setDescription('Craft an item')
				.setDescriptionLocalization('pt-BR', 'Construa um item')
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to craft')
						.setDescriptionLocalization('pt-BR', 'item para construir')
						.setRequired(false)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setNameLocalization('pt-BR', 'quantidade')
						.setDescription('amount of the item')
						.setDescriptionLocalization('pt-BR', 'quantidade do item')
						.setRequired(false)
						.setMinValue(1)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sellall')
				.setNameLocalization('pt-BR', 'vendertudo')
				.setDescription('Sell (almost) entire inventory to bot')
				.setDescriptionLocalization('pt-BR', 'Venda (quase) todo o inventário para o bot')
				.addStringOption((option) =>
					option
						.setName('lootonly')
						.setNameLocalization('pt-BR', 'somente-loot')
						.setDescription('sell only loot items')
						.setDescriptionLocalization('pt-BR', 'venda apenas itens de loot')
						.setRequired(false)
						.addChoices(
							{
								name: 'yes',
								name_localizations: { 'pt-BR': 'sim' },
								value: 'yes',
							},
							{
								name: 'no',
								name_localizations: { 'pt-BR': 'não' },
								value: 'no',
							}
						)
				)
				.addStringOption((option) =>
					option
						.setName('no-legendary')
						.setNameLocalization('pt-BR', 'sem-lendários')
						.setDescription('sell only non-legendary items')
						.setDescriptionLocalization('pt-BR', 'venda apenas itens não-lendários')
						.setRequired(false)
						.addChoices(
							{
								name: 'yes',
								name_localizations: { 'pt-BR': 'sim' },
								value: 'yes',
							},
							{
								name: 'no',
								name_localizations: { 'pt-BR': 'não' },
								value: 'no',
							}
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sort')
				.setNameLocalization('pt-BR', 'ordenação')
				.setDescription('Change inventory sorting method')
				.setDescriptionLocalization('pt-BR', 'Muda o método de ordenação do inventário')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('use')
				.setNameLocalization('pt-BR', 'usar')
				.setDescription('Use an item')
				.setDescriptionLocalization('pt-BR', 'Use um item')
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item to use')
						.setDescriptionLocalization('pt-BR', 'item para ser usado')
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	execute: async ({ guild, interaction, instance, member, subcommand, args }) => {
		try {
			await interaction.deferReply().catch(() => {});
			try {
				var type = interaction.options.getSubcommand();
			} catch {
				var type = subcommand;
			}
			const items = instance.items;

			if (type === 'view') {
				if (subcommand != 'view') {
					var option = interaction.options.getUser('user');
				}

				const target = option ? await guild.members.fetch(option.id) : member;
				const inventory = await readFile(target.id, 'inventory');
				const limit =
					instance.levels[(await readFile(target.id, 'rank')) - 1].inventoryLimit +
					(await readFile(target.id, 'inventoryBonus'));
				const inventoryWorth = instance.getInventoryWorth(inventory);

				if (inventory === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEMS'),
					});
					return;
				}

				const inventorySort = await readFile(target.id, 'inventorySort');

				// Create an array of inventory items with their quantity as a string
				const inventoryItems = Array.from(inventory)
					.reduce((acc, [itemName, quantity]) => {
						if (quantity !== 0) {
							acc.push(`${instance.getItemName(itemName, interaction)} x ${quantity}`);
						}
						return acc;
					}, [])
					.sort((a, b) => {
						switch (inventorySort) {
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
			} else if (type === 'calc') {
				const amount = interaction.options.getInteger('amount');
				const itemKey = getItem(interaction.options.getString('item'));
				const itemJSON = items[itemKey];
				var cost = 0;

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (itemJSON.recipe != undefined) {
					var ingredients = `**${instance.getMessage(interaction, 'INGREDIENTS')}**`;

					for (key in itemJSON.recipe) {
						ingredients += `\n${instance.getItemName(key, interaction)} x ${itemJSON.recipe[key] * amount}`;
						cost += items[key].value * amount;
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
				const inventory = await readFile(member.id, 'inventory');
				const itemKey = getItem(interaction.options.getString('item'));
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
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

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}

				const amount = Math.min(inventory.get(itemKey), interaction.options.getInteger('amount'));
				const falcoins = itemJSON.value * amount;

				inventory.set(itemKey, inventory.get(itemKey) - amount);
				await changeDB(member.id, 'inventory', inventory, true);
				await changeDB(member.id, 'falcoins', falcoins);

				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'SOLD_TITLE', {
						AMOUNT: format(amount),
						ITEM: `${instance.getItemName(itemKey, interaction)}`,
						FALCOINS: format(falcoins),
					}),
					value: instance.getMessage(interaction, 'SOLD_FIELD', {
						REMAINING: format(inventory.get(itemKey)),
						FALCOINS2: format(Number(falcoins / amount)),
					}),
				});

				instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['inventory_view', 'balance'])],
				});
			} else if (type === 'equip') {
				const inventory = await readFile(member.id, 'inventory');
				const equippedItems = await readFile(member.id, 'equippedItems');
				const item = interaction.options.getString('item');
				const itemKey = getItem(item);
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
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

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
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

				equippedItems.push({ name: itemKey, usageCount: 3 });
				inventory.set(itemKey, inventory.get(itemKey) - 1);
				await changeDB(member.id, 'equippedItems', equippedItems, true);
				await changeDB(member.id, 'inventory', inventory, true);

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
			} else if (type === 'craft') {
				const inventory = await readFile(member.id, 'inventory');
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
								if ((inventory.get(key) || 0) < items[item].recipe[key]) return;
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
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
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

					if ((inventory.get(key) || 0) < ingredientAmount) {
						missingIngredients.push(
							`${instance.getItemName(key, interaction)} x ${format(ingredientAmount - (inventory.get(key) || 0))}`
						);
					}

					inventory.set(key, inventory.get(key) - ingredientAmount);
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
						return Math.floor(inventory.get(key) / itemJSON.recipe[key]);
					})
				);

				if (inventory.get(itemKey) === undefined) {
					inventory.set(itemKey, 0);
				}

				inventory.set(itemKey, inventory.get(itemKey) + amount);
				await changeDB(member.id, 'inventory', inventory, true);

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

				var stats = await readFile(interaction.user.id, 'stats');
				stats.set('itemsCrafted', stats.get('itemsCrafted') + amount);
				await changeDB(interaction.user.id, 'stats', stats, true);
			} else if (type === 'sellall') {
				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'SELLALL_TITLE'),
					value: instance.getMessage(interaction, 'SELLALL_VALUE'),
				});

				instance.editReply(interaction, {
					embeds: [embed],
					components: [buttons(['accept'])],
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member.id;
				};

				const collector = interaction.channel.createMessageComponentCollector({
					filter,
					time: 1000 * 300,
					max: 1,
				});

				collector.on('collect', async (i) => {
					const lootonly = interaction.options.getString('lootonly');
					const noLegendary = interaction.options.getString('no-legendary');
					const inventory = await readFile(member.id, 'inventory');
					var itemsSold = [];
					let falcoins = 0;

					for (key of inventory.keys()) {
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

						if (itemJSON.mythical || inventory.get(key) === 0) {
							continue;
						}

						if (noLegendary === 'yes' && itemJSON.rarity === 'Legendary') {
							continue;
						}

						falcoins += itemJSON.value * inventory.get(key);
						itemsSold.push(`${instance.getItemName(key, interaction)}: ${format(inventory.get(key))}`);
						inventory.set(key, 0);
					}

					await changeDB(member.id, 'falcoins', falcoins);
					await changeDB(member.id, 'inventory', inventory, true);

					if (itemsSold.length > 10) {
						var length = itemsSold.length;
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
					await changeDB(member.id, 'inventorySort', sort, true);

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
				const item = interaction.options.getString('item');
				const itemKey = getItem(item);
				const itemJSON = items[itemKey];
				const inventory = await readFile(member.id, 'inventory');

				if (itemKey === undefined) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (inventory.get(itemKey) === undefined || inventory.get(itemKey) === 0) {
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

				inventory.set(itemKey, inventory.get(itemKey) - 1);

				if (itemKey === 'backpack') {
					await changeDB(member.id, 'inventoryBonus', 200000);

					var embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'USE_BACKPACK_TITLE'),
						value: instance.getMessage(interaction, 'USE_BACKPACK_VALUE'),
					});
				} else if (itemKey === 'snowflake') {
					//reset all cooldowns
					await changeDB(
						member.id,
						'cooldowns',
						{
							work: 0,
							hunt: 0,
							explore: 0,
							mine: 0,
							fish: 0,
							scratch: 0,
						},
						true
					);
					await changeDB(member.id, 'inventory', inventory, true);

					var embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'USE_MYTHICAL_TITLE'),
						value: instance.getMessage(interaction, 'USE_SNOWFLAKE_VALUE'),
					});
				}
				await changeDB(member.id, 'inventory', inventory, true);
				instance.editReply(interaction, {
					embeds: [embed],
				});
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
		const items = instance.items;
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

		const filtered = localeItems.filter((choice) => choice.startsWith(focusedValue));
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
	},
};
