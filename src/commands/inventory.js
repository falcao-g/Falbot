const { readFile, format, paginate, getItem, changeDB, buttons, isEquipped } = require('../utils/functions.js');
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
						.setRequired(false)
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
						.setRequired(true)
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
				)
		),
	execute: async ({ guild, interaction, instance, member, subcommand }) => {
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
					interaction.editReply({
						content: instance.getMessage(interaction, 'NO_ITEMS'),
					});
					return;
				}

				const inventorySort = await readFile(target.id, 'inventorySort');

				// Create an array of inventory items with their quantity as a string
				const inventoryItems = Array.from(inventory)
					.reduce((acc, [itemName, quantity]) => {
						if (quantity !== 0) {
							acc.push(`${items[itemName][interaction.locale] ?? items[itemName]['en-US']} x ${quantity}`);
						}
						return acc;
					}, [])
					.sort((a, b) => {
						switch (inventorySort) {
							case 'itemValue':
								return (
									items[getItem(a.split(' x ')[0].split(': ')[1])].value -
									items[getItem(b.split(' x ')[0].split(': ')[1])].value
								);
							case 'quantity':
								return a.split(' x ')[1] - b.split(' x ')[1];
							case 'worth':
								return (
									items[getItem(a.split(' x ')[0].split(': ')[1])].value * a.split(' x ')[1] -
									items[getItem(b.split(' x ')[0].split(': ')[1])].value * b.split(' x ')[1]
								);
							default:
								return a.split(' x ')[0].split(': ')[1].localeCompare(b.split(' x ')[0].split(': ')[1]);
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
			} else if (type === 'calc') {
				const amount = interaction.options.getInteger('amount');
				const itemJSON = items[getItem(interaction.options.getString('item'))];

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (itemJSON.recipe != undefined) {
					var ingredients = `**${instance.getMessage(interaction, 'INGREDIENTS')}**`;

					for (key in itemJSON.recipe) {
						ingredients += `\n${items[key][interaction.locale] ?? items[key]['en-US']} x ${
							itemJSON.recipe[key] * amount
						}`;
					}
				}

				const embed = instance
					.createEmbed(member.displayColor)
					.setTitle(instance.getMessage(interaction, 'CALCULATOR'))
					.addFields({
						name: `${itemJSON[interaction.locale] ?? itemJSON['en-US']} x ${amount}`,
						value: `${ingredients != undefined ? ingredients : ''}\n${instance.getMessage(
							interaction,
							'COST'
						)} **${format(itemJSON.value * amount)} falcoins**`,
					});

				interaction.editReply({
					embeds: [embed],
				});
			} else if (type === 'sell') {
				const inventory = await readFile(member.id, 'inventory');
				const itemKey = getItem(interaction.options.getString('item'));
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
					interaction.editReply({
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
						ITEM: itemJSON[interaction.locale] ?? itemJSON['en-US'],
						FALCOINS: format(falcoins),
					}),
					value: instance.getMessage(interaction, 'SOLD_FIELD', {
						REMAINING: format(inventory.get(itemKey)),
						FALCOINS2: format(Number(falcoins / amount)),
					}),
				});

				interaction.editReply({
					embeds: [embed],
					components: [buttons(['inventory_view', 'balance'])],
				});
			} else if (type === 'equip') {
				const inventory = await readFile(member.id, 'inventory');
				const equippedItems = await readFile(member.id, 'equippedItems');
				const item = interaction.options.getString('item');

				if (item === null) {
					const embed = instance.createEmbed(member.displayColor);

					listItems = [];
					for (key in items) {
						if (items[key].equip === true) {
							const name = items[key][interaction.locale] ?? items[key]['en-US'];
							listItems.push(
								name + ' - ' + instance.getMessage(interaction, items[key]['effect'].toUpperCase()).split(':')[2]
							);
						}
					}
					embed.addFields({
						name: instance.getMessage(interaction, 'EQUIP_TITLE'),
						value: listItems.join('\n'),
					});

					interaction.editReply({
						embeds: [embed],
					});
					return;
				}

				const itemKey = getItem(item);
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (itemJSON.equip != true) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'CANT_EQUIP'),
					});
					return;
				}

				if (inventory.get(itemKey) === 0 || inventory.get(itemKey) === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}

				if (await isEquipped(member, itemKey)) {
					interaction.editReply({
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
						ITEM: itemJSON[interaction.locale] ?? itemJSON['en-US'],
					}),
					value: instance.getMessage(interaction, 'EQUIPPED_VALUE', {
						ITEM: itemJSON[interaction.locale] ?? itemJSON['en-US'],
					}),
				});

				interaction.editReply({
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
						if (interaction.customId.startsWith('craft')) {
							var item = interaction.customId.split(' ')[2];
							var amount = Number(interaction.customId.split(' ')[1]);
						} else {
							var item = null;
							var amount = null;
						}
					}
				}

				//the bot sends a string select menu containing all items that can be crafted
				if (item === null || amount === null) {
					const row = new ActionRowBuilder().addComponents([
						new StringSelectMenuBuilder()
							.setCustomId('inventory craft')
							.setPlaceholder(instance.getMessage(interaction, 'CRAFT_PLACEHOLDER'))
							.addOptions(
								Object.keys(items)
									.map((item) => {
										if (items[item].recipe === undefined) return;

										for (key in items[item].recipe) {
											if ((inventory.get(key) || 0) < items[item].recipe[key]) return;
										}

										const name = items[item][interaction.locale] ?? items[item]['en-US'];

										return {
											label: name.split(':')[2],
											value: item,
											emoji: items[item].emoji,
										};
									})
									.filter((item) => item !== undefined)
							),
					]);

					const embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'CRAFT_TITLE'),
						value: instance.getMessage(interaction, 'CRAFT_VALUE'),
					});

					interaction.editReply({
						components: [row],
						embeds: [embed],
					});
					return;
				}

				const itemKey = getItem(item);
				const itemJSON = items[itemKey];

				if (itemJSON === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (itemJSON.recipe === undefined) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'CANT_CRAFT'),
					});
					return;
				}

				ingredients = [];
				missingIngredients = [];
				for (key in itemJSON.recipe) {
					const ingredientJSON = items[key];
					const ingredientAmount = itemJSON.recipe[key] * amount;

					if ((inventory.get(key) || 0) < ingredientAmount) {
						missingIngredients.push(
							`${ingredientJSON[interaction.locale] ?? ingredientJSON['en-US']} x ${format(
								ingredientAmount - (inventory.get(key) || 0)
							)}`
						);
					}

					inventory.set(key, inventory.get(key) - ingredientAmount);
					ingredients.push(
						`${ingredientJSON[interaction.locale] ?? ingredientJSON['en-US']}: ${format(ingredientAmount)}`
					);
				}

				if (missingIngredients.length > 0) {
					interaction.editReply({
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
						ITEM: itemJSON[interaction.locale] ?? itemJSON['en-US'],
						AMOUNT: format(amount),
					}),
					value: instance.getMessage(interaction, 'CRAFTED_VALUE', {
						INGREDIENTS: ingredients.join('\n'),
						ITEM: itemJSON[interaction.locale] ?? itemJSON['en-US'],
						AMOUNT: format(amount),
						MAXAMOUNT: format(maxAmount),
					}),
				});

				const row = new ActionRowBuilder().addComponents([
					new ButtonBuilder()
						.setCustomId(`craft 1 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 1')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`craft 10 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 10')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`craft 100 ${itemKey}`)
						.setLabel(instance.getMessage(interaction, 'CRAFT') + ' 100')
						.setStyle('Secondary'),
					new ButtonBuilder()
						.setCustomId(`craft ${maxAmount} ${itemKey} max`)
						.setLabel(instance.getMessage(interaction, 'CRAFT_MAX'))
						.setStyle('Secondary'),
				]);

				interaction.editReply({
					embeds: [embed],
					components: [row],
				});
			} else if (type === 'sellall') {
				const embed = instance.createEmbed(member.displayColor).addFields({
					name: instance.getMessage(interaction, 'SELLALL_TITLE'),
					value: instance.getMessage(interaction, 'SELLALL_VALUE'),
				});

				interaction.editReply({
					embeds: [embed],
					components: [buttons(['accept'])],
				});

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === member.id;
				};

				const collector = interaction.channel.createMessageComponentCollector({
					filter,
					time: 1000 * 300,
				});

				collector.on('collect', async (i) => {
					const lootonly = interaction.options.getString('lootonly');
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

						if (itemJSON.rarity === 'Legendary' || inventory.get(key) === 0) {
							continue;
						}

						falcoins += itemJSON.value * inventory.get(key);
						itemsSold.push(`${itemJSON[interaction.locale] ?? itemJSON['en-US']}: ${format(inventory.get(key))}`);
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

					await interaction.editReply({
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

					await interaction.editReply({
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
					interaction.editReply({
						content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
							VALUE: item,
						}),
					});
					return;
				}

				if (inventory.get(itemKey) === undefined || inventory.get(itemKey) === 0) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'NO_ITEM'),
					});
					return;
				}

				if (itemJSON.use != true) {
					interaction.editReply({
						content: instance.getMessage(interaction, 'CANT_USE'),
					});
					return;
				}

				inventory.set(itemKey, inventory.get(itemKey) - 1);

				if (itemKey === 'backpack') {
					await changeDB(member.id, 'inventoryBonus', 200000);
					await changeDB(member.id, 'inventory', inventory, true);

					const embed = instance.createEmbed(member.displayColor).addFields({
						name: instance.getMessage(interaction, 'USE_BACKPACK_TITLE'),
						value: instance.getMessage(interaction, 'USE_BACKPACK_VALUE'),
					});

					interaction.editReply({
						embeds: [embed],
					});
				}
			}
		} catch (err) {
			console.error(`inventory: ${err}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
