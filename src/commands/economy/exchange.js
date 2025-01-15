const { SlashCommandBuilder } = require('discord.js');
const { format, buttons } = require('../../utils/functions.js');
const { numerize } = require('numerize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exchange')
		.setNameLocalizations({
			'pt-BR': 'troca',
			'es-ES': 'intercambio',
		})
		.setDescription('Exchange falcoins and items with other users')
		.setDescriptionLocalizations({
			'pt-BR': 'Troque falcoins e itens com outros usuários',
			'es-ES': 'Intercambia falcoins e items con otros usuarios',
		})
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalizations({
					'pt-BR': 'usuário',
					'es-ES': 'usuario',
				})
				.setDescription('the user to trade with')
				.setDescriptionLocalizations({
					'pt-BR': 'com quem você quer trocar',
					'es-ES': 'con quien quieres intercambiar',
				})
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('give')
				.setNameLocalizations({
					'pt-BR': 'oferecer',
					'es-ES': 'ofrecer',
				})
				.setDescription('the items or falcoins to give separated by commas (ex: 1000 falcoins, 1 rock, 10 fish)')
				.setDescriptionLocalizations({
					'pt-BR': 'os itens ou falcoins para oferecer separados por vírgulas (ex: 1000 falcoins, 1 pedra)',
					'es-ES': 'los items o falcoins para ofrecer separados por comas (ex: 1000 falcoins, 1 piedra)',
				})
				.setRequired(true)
				.setMaxLength(100)
		)
		.addStringOption((option) =>
			option
				.setName('receive')
				.setNameLocalizations({
					'pt-BR': 'receber',
					'es-ES': 'recibir',
				})
				.setDescription('the items or falcoins to receive separated by commas (ex: 1000 falcoins, 1 rock, 10 fish)')
				.setDescriptionLocalizations({
					'pt-BR': 'os itens ou falcoins para receber separados por vírgulas (ex: 1000 falcoins, 1 pedra)',
					'es-ES': 'los items o falcoins para recibir separados por comas (ex: 1000 falcoins, 1 piedra)',
				})
				.setRequired(true)
				.setMaxLength(100)
		),
	execute: async ({ guild, interaction, user, member, instance, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const offer = interaction.options.getString('give');
			const receive = interaction.options.getString('receive');
			var recipient = await guild.members.fetch(interaction.options.getUser('user').id);
			const recipientFile = await database.player.findOne(recipient.user.id);
			const userFile = await database.player.findOne(user.id);
			const { items } = instance;
			const displayColor = await instance.getUserDisplay('displayColor', member);
			const memberDisplayName = await instance.getUserDisplay('displayName', member);
			const recipientDisplayName = await instance.getUserDisplay('displayName', recipient);

			if (recipient.user === user) {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'CANT_EXCHANGE_ALONE'),
				});
				return;
			}

			//separate the items and falcoins the user wants to give, they are separated by commas
			var offerItems = offer.split(',');
			var offerFalcoins = 0;
			var offerItemsNames = [];
			var offerItemsAmount = [];

			//separate the items and falcoins the user wants to receive, they are separated by commas
			var receiveItems = receive.split(',');
			var receiveFalcoins = 0;
			var receiveItemsNames = [];
			var receiveItemsAmount = [];

			//separate the falcoins from the items
			for (var i = 0; i < offerItems.length; i++) {
				if (offerItems[i].includes('falcoins')) {
					offerFalcoins = numerize(offerItems[i].split(' ')[0], userFile.falcoins);
				} else {
					offerItems[i] = offerItems[i].trim();
					var itemName = items.getItem(offerItems[i].split(' ').slice(1).join(' ')).id;
					if (itemName === undefined) {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'BAD_VALUE', {
								VALUE: offerItems[i].split(' ')[1],
							}),
						});
						return;
					}
					try {
						offerItemsNames.push(itemName);
						offerItemsAmount.push(numerize(offerItems[i].split(' ')[0], userFile.inventory.get(itemName)));
					} catch {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'BAD_VALUE', {
								VALUE: offerItems[i],
							}),
						});
						return;
					}
				}
			}

			//separate the falcoins from the items
			for (var i = 0; i < receiveItems.length; i++) {
				if (receiveItems[i].includes('falcoins')) {
					receiveFalcoins = numerize(receiveItems[i].split(' ')[0], recipientFile.falcoins);
				} else {
					receiveItems[i] = receiveItems[i].trim();
					var itemName = items.getItem(receiveItems[i].split(' ').slice(1).join(' ')).id;
					if (itemName === undefined) {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'BAD_VALUE', {
								VALUE: receiveItems[i].split(' ')[1],
							}),
						});
						return;
					}
					try {
						receiveItemsNames.push(itemName);
						receiveItemsAmount.push(numerize(receiveItems[i].split(' ')[0], recipientFile.inventory.get(itemName)));
					} catch {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'BAD_VALUE', {
								VALUE: receiveItems[i],
							}),
						});
						return;
					}
				}
			}

			//check if the user has the items and falcoins to give
			if (offerFalcoins > userFile.falcoins || receiveFalcoins > recipientFile.falcoins) {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'INSUFFICIENT_ACCOUNTS'),
				});
				return;
			}

			const offerFormated = [offerFalcoins ? `**${format(offerFalcoins)}** :coin: falcoins` : ''];
			for (var i = 0; i < offerItemsNames.length; i++) {
				if (userFile.inventory.get(offerItemsNames[i]) < offerItemsAmount[i]) {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'INSUFICIENT_ITEM_EXCHANGE', {
							USER: member,
							ITEM: instance.getItemName(offerItemsNames[i], interaction),
						}),
					});
					return;
				}
				offerFormated.push(`${offerItemsAmount[i]} x ${instance.getItemName(offerItemsNames[i], interaction)}`);
			}

			const receiveFormated = [receiveFalcoins ? `**${format(receiveFalcoins)}** :coin: falcoins` : ''];
			for (var i = 0; i < receiveItemsNames.length; i++) {
				if (recipientFile.inventory.get(receiveItemsNames[i]) < receiveItemsAmount[i]) {
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'INSUFICIENT_ITEM_EXCHANGE', {
							USER: recipient,
							ITEM: instance.getItemName(receiveItemsNames[i], interaction),
						}),
					});
					return;
				}
				receiveFormated.push(`${receiveItemsAmount[i]} x ${instance.getItemName(receiveItemsNames[i], interaction)}`);
			}

			//create the message to send to the user
			const embed = instance.createEmbed(displayColor);
			embed.setTitle(
				instance.getMessage(interaction, 'EXCHANGE_PROPOSAL', {
					USER: memberDisplayName,
					USER2: recipientDisplayName,
				})
			);
			embed.addFields(
				{
					name: instance.getMessage(interaction, 'OFFER', {
						USER: memberDisplayName,
					}),
					value: offerFormated.join('\n'),
					inline: true,
				},
				{
					name: instance.getMessage(interaction, 'RECEIVE'),
					value: receiveFormated.join('\n'),
					inline: true,
				}
			);

			var answer = await instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['accept', 'refuse'])],
				fetchReply: true,
			});

			const filter = (btInt) => {
				return instance.defaultFilter(btInt) && btInt.user.id === recipient.user.id;
			};

			const collector = answer.createMessageComponentCollector({
				filter,
				max: 1,
				time: 1000 * 300,
			});

			collector.on('end', async (collected) => {
				if (collected.size === 0) {
					instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'EXCHANGE_CANCELLED', {
							USER: recipient,
						}),
						embeds: [],
						components: [],
					});
				} else if (collected.first().customId === 'refuse') {
					embed.setTitle(
						instance.getMessage(interaction, 'EXCHANGE_REFUSED', {
							USER: memberDisplayName,
							USER2: recipientDisplayName,
						})
					);

					instance.editReply(interaction, {
						embeds: [embed],
						components: [],
					});
				} else {
					userFile.falcoins -= offerFalcoins;
					recipientFile.falcoins -= receiveFalcoins;
					userFile.falcoins += receiveFalcoins;
					recipientFile.falcoins += offerFalcoins;

					for (var i = 0; i < offerItemsNames.length; i++) {
						userFile.inventory.set(
							offerItemsNames[i],
							(userFile.inventory.get(offerItemsNames[i]) ?? 0) - offerItemsAmount[i]
						);
						recipientFile.inventory.set(
							offerItemsNames[i],
							(recipientFile.inventory.get(offerItemsNames[i]) ?? 0) + offerItemsAmount[i]
						);
					}

					for (var i = 0; i < receiveItemsNames.length; i++) {
						recipientFile.inventory.set(
							receiveItemsNames[i],
							(recipientFile.inventory.get(receiveItemsNames[i]) ?? 0) - receiveItemsAmount[i]
						);
						userFile.inventory.set(
							receiveItemsNames[i],
							(userFile.inventory.get(receiveItemsNames[i]) ?? 0) + receiveItemsAmount[i]
						);
					}

					const embed = instance.createEmbed(displayColor);
					embed.setTitle(
						instance.getMessage(interaction, 'EXCHANGE_ACCEPTED', {
							USER: memberDisplayName,
							USER2: recipientDisplayName,
						})
					);

					embed.addFields(
						{
							name: instance.getMessage(interaction, 'OFFER', {
								USER: memberDisplayName,
							}),
							value: offerFormated.join('\n'),
							inline: true,
						},
						{
							name: instance.getMessage(interaction, 'RECEIVE'),
							value: receiveFormated.join('\n'),
							inline: true,
						}
					);

					instance.editReply(interaction, {
						embeds: [embed],
						components: [],
					});
					userFile.save();
					recipientFile.save();
				}
			});
		} catch (error) {
			console.error(`exchange: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
