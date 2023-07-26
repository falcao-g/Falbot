const { readFile, changeDB, randint, pick, isEquipped, useItem, buttons } = require('../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('hunt')
		.setNameLocalization('pt-BR', 'caçar')
		.setDescription('Go hunting to get items')
		.setDescriptionLocalization('pt-BR', 'Vá caçar para conseguir items')
		.setDMPermission(false),
	execute: async ({ interaction, instance, member }) => {
		await interaction.deferReply();
		const items = instance.items;
		const inventory = await readFile(member.id, 'inventory');
		const limit = instance.levels[(await readFile(member.id, 'rank')) - 1].inventoryLimit;
		const inventoryWorth = instance.getInventoryWorth(inventory);
		var buff = 1;
		var buffText = '';

		if (inventoryWorth >= limit) {
			interaction.editReply({
				content: instance.getMessage(interaction, 'OVER_LIMIT'),
			});
			return;
		}

		if (await isEquipped(member, 'huntknife')) {
			buff = 2;
			await useItem(member, 'huntknife');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: items['huntknife'][interaction.locale],
				BUFF: 2,
			})}**`;
		}

		if (await isEquipped(member, 'diaknife')) {
			buff = 4;
			await useItem(member, 'diaknife');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: items['diaknife'][interaction.locale],
				BUFF: 4,
			})}**`;
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
			if (items[item].hunting === true) {
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
			var amount = randint(1, amounts[items[selectedItem]['rarity']]) * buff;
			total += amount;
			text += `**${items[selectedItem][interaction.locale]}** x ${amount}\n`;
			filteredItems = filteredItems.filter((item) => item[0] !== selectedItem);
			inventory.set(selectedItem, (inventory.get(selectedItem) || 0) + amount);
			selectedItems.push(selectedItem);
		}

		await changeDB(member.id, 'inventory', inventory, true);

		var embed = instance.createEmbed({ member }).addFields({
			name:
				':dagger: ' +
				instance.getMessage(interaction, 'FOUND', {
					AMOUNT: total,
				}),
			value: text + buffText,
		});

		await interaction.editReply({
			embeds: [embed],
			components: [buttons(['balance', 'inventory_view', 'cooldowns'])],
		});
	},
};
