const { format, getItem, readFile } = require('../../utils/functions.js');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iteminfo')
		.setDescription('View item info')
		.setDescriptionLocalization('pt-BR', 'Veja informações sobre um item')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('item')
				.setDescription('item to see information about')
				.setDescriptionLocalization('pt-BR', 'item para ver informações sobre')
				.setRequired(true)
				.setAutocomplete(true)
		),
	execute: async ({ interaction, instance, member, subcommand, args }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const items = instance.items;

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

			const itemKey = getItem(item);
			const itemJSON = items[itemKey];
			const inventory = await readFile(member.id, 'inventory');

			if (itemJSON === undefined) {
				interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
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
			} else {
				information += `${instance.getMessage(interaction, 'CANT_SELL')}`;
			}

			if (itemJSON.mythical) {
				information += `\n${instance.getMessage(interaction, 'MYTHICAL')}`;
			}

			if (itemJSON.equip != undefined) {
				information += `\n${instance.getMessage(interaction, 'EQUIPPABLE')}`;
				information += `\n${instance.getMessage(interaction, itemJSON.effect.toUpperCase())}`;
			}

			if (itemJSON.use != undefined) {
				information += `\n${instance.getMessage(interaction, 'USABLE')}`;
				information += `\n${instance.getMessage(interaction, itemJSON.effect.toUpperCase())}`;
			}

			if (inventory.get(itemKey))
				information += `\n${instance.getMessage(interaction, 'OWNED', {
					AMOUNT: inventory.get(itemKey),
				})}`;

			const embed = instance
				.createEmbed(member.displayColor)
				.setTitle(`${instance.getItemName(itemKey, interaction)} ` + '(`' + `${itemKey}` + '`)')
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
						if (key === itemKey) {
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
				new ButtonBuilder().setCustomId(`iteminfo previous ${itemKey}`).setEmoji('⬅️').setStyle('Secondary'),
				new ButtonBuilder().setCustomId(`iteminfo next ${itemKey}`).setEmoji('➡️').setStyle('Secondary'),
			]);
			interaction
				.editReply({
					embeds: [embed],
					components: [row],
				})
				.catch(() => {
					throw new Error('Failed to send message');
				});
		} catch (err) {
			console.error(`iteminfo: ${err}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
	autocomplete: async ({ interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase();
		const items = instance.items;
		const localeItems = Object.keys(items).map((key) => {
			return instance.getItemName(key, interaction);
		});
		const filtered = localeItems.filter((choice) => choice.startsWith(focusedValue));
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })).slice(0, 25));
	},
};
