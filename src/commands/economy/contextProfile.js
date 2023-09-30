const { ContextMenuCommandBuilder, ApplicationCommandType, time } = require('discord.js');
const { format, readFile, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's profile")
		.setNameLocalization('pt-BR', 'Ver o perfil do usuário')
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ instance, interaction }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const target = interaction.targetMember;
			const { rank, falcoins, vitorias, banco, inventory, voteStreak, tickets, createdAt } = await readFile(
				target.user.id
			);
			const limit = instance.levels[rank - 1].bankLimit;
			const items = instance.items;

			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				var rankText = ':sparkles: ' + instance.getMessage(interaction, 'MAX_RANK2');
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				var rankText = instance.getMessage(interaction, 'BALANCE_RANKUP');
			} else {
				var rankText = instance.getMessage(interaction, 'BALANCE_RANKUP2', {
					FALCOINS: format(instance.levels[rank - 1].falcoinsToLevelUp - falcoins),
				});
			}

			var inventoryQuantity = 0;
			const inventoryWorth = Array.from(inventory).reduce((acc, [itemName, quantity]) => {
				acc += items[itemName]['value'] * quantity;
				inventoryQuantity += quantity;
				return acc;
			}, 0);

			const embed = instance
				.createEmbed(target.displayColor)
				.setTitle(instance.getMessage(interaction, 'PROFILE', { USER: target.displayName }))
				.setThumbnail(target.user.avatarURL())
				.addFields(
					{
						name: 'Rank',
						value: `${instance.getMessage(interaction, rank)}\n${rankText}`,
					},
					{
						name: 'Info',
						value: instance.getMessage(interaction, 'PROFILE_INFOS', {
							FALCOINS: format(falcoins),
							WINS: format(vitorias),
							BANK: format(banco),
							LIMIT: format(limit),
							TICKETS: format(tickets),
							QUANTITY: format(inventoryQuantity),
							WORTH: format(inventoryWorth),
							STREAK: Math.floor(voteStreak / 2),
							CREATED: time(createdAt, 'd'),
						}),
					}
				);

			await instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['cooldowns', 'help'])],
			});
		} catch (error) {
			console.error(`contextProfile: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
