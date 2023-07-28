const {
	readFile,
	getRoleColor,
	changeDB,
	randint,
	pick,
	isEquipped,
	useItem,
	buttons,
} = require('../utils/functions.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('explore')
		.setNameLocalization('pt-BR', 'explorar')
		.setDescription('Go explore to get items')
		.setDescriptionLocalization('pt-BR', 'Vá explorar para conseguir items')
		.setDMPermission(false),
	execute: async ({ guild, interaction, instance, member }) => {
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

		if (await isEquipped(member, 'activewear')) {
			buff = 2;
			await useItem(member, 'activewear');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: items['activewear'][interaction.locale] ?? items['activewear']['en-US'],
				BUFF: 2,
			})}**`;
		}

		if (await isEquipped(member, 'coat')) {
			buff = 4;
			await useItem(member, 'coat');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: items['coat'][interaction.locale] ?? items['coat']['en-US'],
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
			if (items[item].exploring === true) {
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
			var name = items[selectedItem][interaction.locale] ?? items[selectedItem]['en-US'];
			total += amount;
			text += `**${name}** x ${amount}\n`;
			filteredItems = filteredItems.filter((item) => item[0] !== selectedItem);
			inventory.set(selectedItem, (inventory.get(selectedItem) || 0) + amount);
			selectedItems.push(selectedItem);
		}

		await changeDB(member.id, 'inventory', inventory, true);

		var embed = new EmbedBuilder()
			.setColor(await getRoleColor(guild, member.id))
			.addFields({
				name:
					':compass: ' +
					instance.getMessage(interaction, 'FOUND', {
						AMOUNT: total,
					}),
				value: text + buffText,
			})
			.setFooter({ text: 'by Falcão ❤️' });

		await interaction.editReply({
			embeds: [embed],
			components: [buttons(['balance', 'inventory_view', 'cooldowns'])],
		});
	},
};
