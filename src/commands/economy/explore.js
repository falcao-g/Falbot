const { randint, pick, isEquipped, useItem, buttons } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('explore')
		.setNameLocalizations({
			'pt-BR': 'explorar',
			'es-ES': 'explorar',
		})
		.setDescription('Go explore to get items')
		.setDescriptionLocalizations({
			'pt-BR': 'Vá explorar para conseguir items',
			'es-ES': 'Ve a explorar para conseguir items',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance, member, database }) => {
		await interaction.deferReply().catch(() => {});
		const items = instance.items;
		const player = await database.player.findOne(member.id);
		const limit = instance.levels[player.rank - 1].inventoryLimit + player.inventoryBonus;
		const { inventoryWorth } = instance.getInventoryInfo(player.inventory);
		var buff = 1;
		var buffText = '';
		var luck = 1;

		if (inventoryWorth >= limit) {
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'OVER_LIMIT'),
			});
			return;
		}

		if (await isEquipped(member, 'activewear')) {
			buff = 2;
			await useItem(member, 'activewear');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemName('activewear', interaction)}`,
				BUFF: 2,
			})}**`;
		}

		if (await isEquipped(member, 'coat')) {
			buff = 4;
			await useItem(member, 'coat');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemName('coat', interaction)}`,
				BUFF: 4,
			})}**`;
		}

		if (instance.activeEvents.has('Search Party')) {
			if (buffText !== '') buffText += '\n';
			buffText += `${instance.getMessage(interaction, 'SEARCH_PARTY_BONUS')}`;
			buff ? (buff *= 2) : (buff = 2);
			luck = 1.5;
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
			var selectedItem = pick(filteredItems, luck);
			var softenedBuff = randint((buff * 10) / 2, buff * 10) / 10;
			var amount = Math.floor(randint(1, amounts[items[selectedItem]['rarity']]) * softenedBuff);
			var name = `${instance.getItemName(selectedItem, interaction)}`;
			total += amount;
			text += `**${name}** x ${amount}\n`;
			filteredItems = filteredItems.filter((item) => item[0] !== selectedItem);
			player.inventory.set(selectedItem, (player.inventory.get(selectedItem) || 0) + amount);
			selectedItems.push(selectedItem);
		}

		var embed = instance.createEmbed(member.displayColor).addFields({
			name:
				':compass: ' +
				instance.getMessage(interaction, 'FOUND', {
					AMOUNT: total,
				}),
			value: text + buffText,
		});

		await instance.editReply(interaction, {
			embeds: [embed],
			components: [buttons(['balance', 'inventory_view', 'cooldowns'])],
		});

		player.stats.set('timesExplored', player.stats.get('timesExplored') + 1);
		player.stats.set('itemsFound', player.stats.get('itemsFound') + total);
		player.save();
	},
};
