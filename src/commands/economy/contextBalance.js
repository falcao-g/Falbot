const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { format, buttons } = require('../../utils/functions.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's balance")
		.setNameLocalizations({
			'pt-BR': 'Ver a conta do usuário',
			'es-ES': 'Ver la cuenta del usuario',
		})
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ instance, interaction, database }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const target = interaction.targetMember;
			const { rank, falcoins, wins, bank } = await database.player.findOne(target.user.id);
			const displayColor = await instance.getUserDisplay('displayColor', target);
			const displayName = await instance.getUserDisplay('displayName', target);

			const embed = instance
				.createEmbed(displayColor)
				.setTitle(instance.getMessage(interaction, rank) + ' ' + displayName)
				.addFields(
					{
						name: ':coin: Falcoins',
						value: `${format(falcoins)}`,
						inline: true,
					},
					{
						name: ':trophy: ' + instance.getMessage(interaction, 'WINS'),
						value: `${format(wins)}`,
						inline: true,
					},
					{
						name: ':bank: ' + instance.getMessage(interaction, 'BANK'),
						value: `${format(bank)}`,
						inline: true,
					}
				);
			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(':sparkles: ' + instance.getMessage(interaction, 'MAX_RANK2'));
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				embed.setDescription(instance.getMessage(interaction, 'BALANCE_RANKUP'));
			} else {
				embed.setDescription(
					instance.getMessage(interaction, 'BALANCE_RANKUP2', {
						FALCOINS: format(instance.levels[rank - 1].falcoinsToLevelUp - falcoins),
					})
				);
			}

			await instance.editReply(interaction, {
				embeds: [embed],
				components: [buttons(['cooldowns', 'help'])],
			});
		} catch (error) {
			console.error(`balance: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
