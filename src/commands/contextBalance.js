const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { format, readFile, buttons } = require('../utils/functions.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's balance")
		.setNameLocalization('pt-BR', 'Ver a conta do usuário')
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ instance, interaction }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const target = interaction.targetMember;
			const { rank, falcoins, vitorias, banco } = await readFile(target.user.id);

			const embed = instance
				.createEmbed(target.displayColor)
				.setTitle(instance.getMessage(interaction, rank) + ' ' + target.displayName)
				.addFields(
					{
						name: ':coin: Falcoins',
						value: `${format(falcoins)}`,
						inline: true,
					},
					{
						name: ':trophy: ' + instance.getMessage(interaction, 'VITORIAS'),
						value: `${format(vitorias)}`,
						inline: true,
					},
					{
						name: ':bank: ' + instance.getMessage(interaction, 'BANCO'),
						value: `${format(banco)}`,
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

			await interaction.editReply({
				embeds: [embed],
				components: [buttons(['cooldowns', 'help'])],
			});
		} catch (error) {
			console.error(`balance: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
				components: [],
			});
		}
	},
};
