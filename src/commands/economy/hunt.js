const { randint, pick, isEquipped, useItem, buttons } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 60 * 60,
	data: new SlashCommandBuilder()
		.setName('hunt')
		.setNameLocalizations({
			'pt-BR': 'caçar',
			'es-ES': 'cazar',
		})
		.setDescription('Go hunting to get items')
		.setDescriptionLocalizations({
			'pt-BR': 'Vá caçar para conseguir items',
			'es-ES': 'Ve a cazar para conseguir items',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance, member, database }) => {
		await interaction.deferReply().catch(() => {});
		const { items } = instance;
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

		if (await isEquipped(member, 'huntknife')) {
			buff = 2;
			await useItem(member, 'huntknife');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemName('huntknife', interaction)}`,
				BUFF: 2,
			})}**`;
		}

		if (await isEquipped(member, 'diaknife')) {
			buff = 4;
			await useItem(member, 'diaknife');
			buffText = `**${instance.getMessage(interaction, 'BUFF', {
				ITEM: `${instance.getItemName('diaknife', interaction)}`,
				BUFF: 4,
			})}**`;
		}

		if (instance.activeEvents.has('Stampede')) {
			if (buffText !== '') buffText += '\n';
			buffText += `${instance.getMessage(interaction, 'STAMPEDE_BONUS')}`;
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
			var selectedItem = pick(filteredItems, luck);
			var softenedBuff = Math.max(1, randint((buff * 10) / 2, buff * 10) / 10);
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
				':dagger: ' +
				instance.getMessage(interaction, 'FOUND', {
					AMOUNT: total,
				}),
			value: text + buffText,
		});

		await instance.editReply(interaction, {
			embeds: [embed],
			components: [buttons(['balance', 'inventory_view', 'cooldowns'])],
		});

		player.stats.timesHunted += 1;
		player.stats.itemsFound += total;
		player.save();
	},
};
