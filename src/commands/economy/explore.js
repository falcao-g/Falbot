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

		const buffs = [
			{ item: 'activewear', value: 2 },
			{ item: 'coat', value: 4 },
		];

		for (const { item, value } of buffs) {
			if (await isEquipped(member, item)) {
				buff = value;
				await useItem(member, item);
				buffText += `**${instance.getMessage(interaction, 'BUFF', {
					ITEM: instance.getItemName(item, interaction),
					BUFF: value,
				})}**\n`;
			}
		}

		if (instance.randomEvents.isActive('Search Party')) {
			buffText += `${instance.getMessage(interaction, 'SEARCH_PARTY_BONUS')}`;
			buff *= 2;
			luck = 1.5;
		}

		var filteredItems = Array.from(items.exploringItems.entries()).map(([item, itemDetails]) => [
			itemDetails,
			items.rarityWeights[itemDetails['rarity']],
		]);

		const numItems = randint(3, 5);
		let total = 0;
		let text = '';

		for (let i = 0; i < numItems; i++) {
			const selectedItem = pick(filteredItems, luck);
			const softenedBuff = Math.max(1, randint((buff * 10) / 2, buff * 10) / 10);
			const amount = Math.floor(randint(1, items.rarityAmounts[selectedItem.rarity]) * softenedBuff);
			const name = instance.getItemName(selectedItem.id, interaction);

			total += amount;
			text += `**${name}** x ${amount}\n`;

			filteredItems = filteredItems.filter(([item]) => item !== selectedItem);
			player.inventory.set(selectedItem.id, (player.inventory.get(selectedItem.id) || 0) + amount);
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

		player.stats.timesExplored += 1;
		player.stats.itemsFound += total;
		player.save();

		instance.achievement.sendAchievementMessage(
			interaction,
			interaction.user.id,
			instance.achievement.getById('small_collection')
		);

		instance.achievement.sendAchievementMessage(
			interaction,
			interaction.user.id,
			instance.achievement.getById('novice_explorer')
		);
	},
};
