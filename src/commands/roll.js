const roll = require('falbot-dice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setNameLocalization('pt-BR', 'rolar')
		.setDescription('Roll dice for you')
		.setDescriptionLocalization('pt-BR', 'Rola dados para você')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('dice')
				.setNameLocalization('pt-BR', 'dados')
				.setDescription('dice to be rolled')
				.setDescriptionLocalization('pt-BR', 'dados a serem rolados')
				.setRequired(true)
				.setMaxLength(500)
		),
	execute: async ({ interaction, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});
			text = interaction.options.getString('dice');

			try {
				var rolled = roll(text);

				if (rolled.length > 2000) {
					await interaction.editReply({
						content: instance.getMessage(interaction, 'ROLL_LIMIT'),
					});
					return;
				}
			} catch {
				await interaction.editReply({
					content: instance.getMessage(interaction, 'VALOR_INVALIDO', {
						VALUE: text,
					}),
				});
				return;
			}

			await interaction.editReply({
				content: `**${instance.getMessage(interaction, 'RESULTADO')}:** ${rolled}`,
			});
		} catch (error) {
			console.error(`roll: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
