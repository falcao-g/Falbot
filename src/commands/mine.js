const { readFile, changeDB, randint, pick, isEquipped, useItem, buttons } = require('../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('mine')
		.setNameLocalization('pt-BR', 'minerar')
		.setDescription('Go mine to get items')
		.setDescriptionLocalization('pt-BR', 'Vá minerar para conseguir items')
		.setDMPermission(false),
	execute: async ({ interaction, instance, member }) => {
		await interaction.deferReply().catch(() => {});
		const items = instance.items;
		const inventory = await readFile(member.id, 'inventory');
		const limit =
			instance.levels[(await readFile(member.id, 'rank')) - 1].inventoryLimit +
			(await readFile(member.id, 'inventoryBonus'));
		const inventoryWorth = instance.getInventoryWorth(inventory);
		var buff = 1;
		var buffText = '';

		if (inventoryWorth >= limit) {
			interaction.editReply({
				content: instance.getMessage(interaction, 'OVER_LIMIT'),
			});
			return;
		}

		if (await isEquipped(member, 'ironpick')) {
			buff = 2;
			await useItem(member, 'ironpick');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemEmoji('ironpick')} ${
					items['ironpick'][interaction.locale] ?? items['ironpick']['en-US']
				}`,
				BUFF: 2,
			})}**`;
		}

		if (await isEquipped(member, 'diapick')) {
			buff = 4;
			await useItem(member, 'diapick');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemEmoji('diapick')} ${
					items['diapick'][interaction.locale] ?? items['diapick']['en-US']
				}`,
				BUFF: 4,
			})}**`;
		}

		if (instance.activeEvents.has('Comet')) {
			if (buffText !== '') buffText += '\n';
			buffText += `${instance.getMessage(interaction, 'COMET_BONUS')}`;
			buff ? (buff *= 2) : (buff = 2);
		}

		// define the weight of each rarity level (the sum of all weights should be 1)
		const weights = {
			Common: 0.5,
			Uncommon: 0.3,
			Rare: 0.11,
			Epic: 0.055,
			Legendary: 0.025,
		};

		//define what amount each rarity can give
		const amounts = {
			Common: 20,
			Uncommon: 15,
			Rare: 10,
			Epic: 5,
			Legendary: 1,
		};

		var filteredItems = Array.from(Object.keys(items)).reduce((acc, item) => {
			if (items[item].mining === true) {
				acc.push([item, weights[items[item]['rarity']]]);
			}
			return acc;
		}, []);

		// randomly select a number of items based on their weights
		const selectedItems = [];
		const numItems = randint(3, 5);
		var total = 0;
		var text = '';
		for (let i = 0; i < numItems; i++) {
			var selectedItem = pick(filteredItems);
			var amount = randint(1, amounts[items[selectedItem]['rarity']]) * randint(1, buff);
			var name = `${instance.getItemEmoji(selectedItem)} ${
				items[selectedItem][interaction.locale] ?? items[selectedItem]['en-US']
			}`;
			total += amount;
			text += `**${name}** x ${amount}\n`;
			filteredItems = filteredItems.filter((item) => item[0] !== selectedItem);
			inventory.set(selectedItem, (inventory.get(selectedItem) || 0) + amount);
			selectedItems.push(selectedItem);
		}

		await changeDB(member.id, 'inventory', inventory, true);

		var embed = instance.createEmbed(member.displayColor).addFields({
			name:
				':pick: ' +
				instance.getMessage(interaction, 'FOUND', {
					AMOUNT: total,
				}),
			value: text + buffText,
		});

		await interaction.editReply({
			embeds: [embed],
			components: [buttons(['balance', 'inventory_view', 'cooldowns'])],
		});

		var stats = await readFile(interaction.user.id, 'stats');
		stats.set('timesMined', stats.get('timesMined') + 1);
		stats.set('itemsFound', stats.get('itemsFound') + total);
		await changeDB(interaction.user.id, 'stats', stats, true);
	},
};
