const { format } = require('../../utils/functions.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iteminfo')
		.setDescription('View item info')
		.setDescriptionLocalizations({
			'pt-BR': 'Veja informações sobre um item',
			'es-ES': 'Ver información del item',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('item')
				.setDescription('item to see information about')
				.setDescriptionLocalizations({
					'pt-BR': 'item para ver informações sobre',
					'es-ES': 'item para ver información sobre',
				})
				.setRequired(true)
				.setAutocomplete(true)
		),
	execute: async ({ interaction, instance, member, subcommand, args, database }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const { items } = instance;
			const player = await database.player.findOne(member.id);

			if (interaction.options !== undefined) {
				var item = interaction.options.getString('item');
			} else {
				var item = args[0];
				var cont = 0;
				for (i in items) {
					if (i == item) {
						var index = subcommand == 'previous' ? cont - 1 : cont + 1;
						break;
					}
					cont++;
				}
				if (index < 0) index = Object.keys(items).length - 1;
				if (index > Object.keys(items).length - 1) index = 0;
				item = Object.keys(items)[index];
			}

			const itemJSON = items.getItem(item);

			if (itemJSON === undefined) {
				instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: item,
					}),
				});
				return;
			}

			if (itemJSON.recipe != undefined) {
				var ingredients = '';

				for (key in itemJSON.recipe) {
					ingredients += `\n${instance.getItemName(key, interaction)} x ${itemJSON.recipe[key]}`;
				}
			}

			var information = ``;

			if (itemJSON.value) {
				information += `:moneybag: ${instance.getMessage(interaction, 'COST')} **${format(itemJSON.value)} falcoins**`;
				const sellOrder = await database.market.getCheapestSellOrder(itemJSON.id);
				if (sellOrder.price != Infinity) {
					information += `\n🛍️ ${instance.getMessage(interaction, 'BUY_FOR')} **${format(sellOrder.price)} falcoins**`;
				}
				const buyOrder = await database.market.getBestBuyOrder(itemJSON.id);
				if (buyOrder.price != 0) {
					information += `\n🛒 ${instance.getMessage(interaction, 'SELL_FOR')} **${format(buyOrder.price)} falcoins**`;
				}
			} else {
				information += `${instance.getMessage(interaction, 'CANT_SELL')}`;
			}

			if (itemJSON.mythical) {
				information += `\n${instance.getMessage(interaction, 'MYTHICAL')}`;
			}

			if (itemJSON.growTime != undefined) {
				information += `\n${instance.getMessage(interaction, 'PLANTABLE')}`;
			}

			if (itemJSON.equip != undefined) {
				information += `\n${instance.getMessage(interaction, 'EQUIPPABLE')}`;
				information += `\n${instance.getMessage(interaction, itemJSON.effect.toUpperCase())}`;
			}

			if (itemJSON.use != undefined) {
				information += `\n${instance.getMessage(interaction, 'USABLE')}`;
				information += `\n${instance.getMessage(interaction, itemJSON.effect.toUpperCase())}`;
			}

			if (player.inventory.get(itemJSON.id))
				information += `\n${instance.getMessage(interaction, 'OWNED', {
					AMOUNT: player.inventory.get(itemJSON.id),
				})}`;

			const embed = instance
				.createEmbed(member.displayColor)
				.setTitle(`${instance.getItemName(itemJSON.id, interaction)} ` + '(`' + `${itemJSON.id}` + '`)')
				.addFields({
					name: instance.getMessage(interaction, 'INFO'),
					value: information,
				});

			if (itemJSON.rarity) {
				embed.setDescription(`**${instance.getMessage(interaction, itemJSON.rarity.toUpperCase())}**`);
			}

			if (ingredients) {
				embed.addFields({
					name: instance.getMessage(interaction, 'INGREDIENTS'),
					value: ingredients,
				});
			}

			var usedToCraft = '';
			var cont = 0;
			craft: for (i in items) {
				if (items[i].recipe != undefined) {
					for (key in items[i].recipe) {
						if (key === itemJSON.id) {
							usedToCraft += `\n${instance.getItemName(i, interaction)}`;
							cont += 1;

							if (cont === 4) {
								usedToCraft += instance.getMessage(interaction, 'AND_MORE');
								break craft;
							}
						}
					}
				}
			}

			if (usedToCraft.length != '') {
				embed.addFields({
					name: instance.getMessage(interaction, 'USED'),
					value: usedToCraft,
				});
			}

			//create two buttons to go to the next and previous item
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder().setCustomId(`iteminfo previous ${itemJSON.id}`).setEmoji('⬅️').setStyle('Secondary'),
				new ButtonBuilder().setCustomId(`iteminfo next ${itemJSON.id}`).setEmoji('➡️').setStyle('Secondary'),
			]);
			interaction.editReply({
				embeds: [embed],
				components: [row],
			});
		} catch (err) {
			console.error(`iteminfo: ${err}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const { items } = instance;
		const localeItems = Array.from(items.all().values()).map((item) => {
			return instance.getItemName(item.id, interaction);
		});
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
