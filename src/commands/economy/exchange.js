const { SlashCommandBuilder } = require('discord.js');
const { readFile, format, changeDB, buttons, getItem } = require('../../utils/functions.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('exchange')
		.setNameLocalization('pt-BR', 'troca')
		.setDescription('Exchange falcoins and items with other users')
		.setDescriptionLocalization('pt-BR', 'Troque falcoins e itens com outros usuários')
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setNameLocalization('pt-BR', 'usuário')
				.setDescription('the user to trade with')
				.setDescriptionLocalization('pt-BR', 'com quem você quer trocar')
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('give')
				.setNameLocalization('pt-BR', 'oferecer')
				.setDescription('the items or falcoins to give separated by commas (ex: 1000 falcoins, 1 rock, 10 fish)')
				.setDescriptionLocalization(
					'pt-BR',
					'os itens ou falcoins para oferecer separados por vírgulas (ex: 1000 falcoins, 1 pedra)'
				)
				.setRequired(true)
				.setMaxLength(100)
		)
		.addStringOption((option) =>
			option
				.setName('receive')
				.setNameLocalization('pt-BR', 'receber')
				.setDescription('the items or falcoins to receive separated by commas (ex: 1000 falcoins, 1 rock, 10 fish)')
				.setDescriptionLocalization(
					'pt-BR',
					'os itens ou falcoins para receber separados por vírgulas (ex: 1000 falcoins, 1 pedra)'
				)
				.setRequired(true)
				.setMaxLength(100)
		),
	execute: async ({ guild, interaction, user, member, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const offer = interaction.options.getString('give');
			const receive = interaction.options.getString('receive');
			var recipient = await guild.members.fetch(interaction.options.getUser('user').id);

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
					offerFalcoins = parseInt(offerItems[i].split(' ')[0]);
				} else {
					offerItems[i] = offerItems[i].trim();
					if (getItem(offerItems[i].split(' ').slice(1).join(' ')) === undefined) {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
								VALUE: offerItems[i].split(' ')[1],
							}),
						});
						return;
					}
					offerItemsNames.push(getItem(offerItems[i].split(' ').slice(1).join(' ')));
					offerItemsAmount.push(parseInt(offerItems[i].split(' ')[0]));
				}
			}

			//separate the falcoins from the items
			for (var i = 0; i < receiveItems.length; i++) {
				if (receiveItems[i].includes('falcoins')) {
					receiveFalcoins = parseInt(receiveItems[i].split(' ')[0]);
				} else {
					receiveItems[i] = receiveItems[i].trim();
					if (getItem(receiveItems[i].split(' ').slice(1).join(' ')) === undefined) {
						await instance.editReply(interaction, {
							content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
								VALUE: receiveItems[i].split(' ')[1],
							}),
						});
						return;
					}
					receiveItemsNames.push(getItem(receiveItems[i].split(' ').slice(1).join(' ')));
					receiveItemsAmount.push(parseInt(receiveItems[i].split(' ')[0]));
				}
			}

			//check if the user has the items and falcoins to give
			const recipientFile = await readFile(recipient.user.id);
			const userFile = await readFile(user.id);

			if (offerFalcoins > userFile.falcoins || receiveFalcoins > recipientFile.falcoins) {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'INSUFICIENTE_CONTAS'),
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
			const embed = instance.createEmbed(member.displayColor);
			embed.setTitle(
				instance.getMessage(interaction, 'EXCHANGE_PROPOSAL', {
					USER: member.displayName,
					USER2: recipient.displayName,
				})
			);
			embed.addFields(
				{
					name: instance.getMessage(interaction, 'OFFER', {
						USER: member.displayName,
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
							USER: member.displayName,
							USER2: recipient.displayName,
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

					await changeDB(user.id, 'falcoins', userFile.falcoins, true);
					await changeDB(recipient.user.id, 'falcoins', recipientFile.falcoins, true);
					await changeDB(user.id, 'inventory', userFile.inventory, true);
					await changeDB(recipient.user.id, 'inventory', recipientFile.inventory, true);

					const embed = instance.createEmbed(member.displayColor);
					embed.setTitle(
						instance.getMessage(interaction, 'EXCHANGE_ACCEPTED', {
							USER: member.displayName,
							USER2: recipient.displayName,
						})
					);

					embed.addFields(
						{
							name: instance.getMessage(interaction, 'OFFER', {
								USER: member.displayName,
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
