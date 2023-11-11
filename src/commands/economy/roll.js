const roll = require('falbot-dice');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setNameLocalizations({
			'pt-BR': 'rolar',
			'es-ES': 'tirar',
		})
		.setDescription('Roll dice for you')
		.setDescriptionLocalizations({
			'pt-BR': 'Rola dados para você',
			'es-ES': 'Tira dados para ti',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('dice')
				.setNameLocalizations({
					'pt-BR': 'dados',
					'es-ES': 'dados',
				})
				.setDescription('dice to be rolled')
				.setDescriptionLocalizations({
					'pt-BR': 'dados a serem rolados',
					'es-ES': 'dados a serem tirados',
				})
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
					await instance.editReply(interaction, {
						content: instance.getMessage(interaction, 'ROLL_LIMIT'),
					});
					return;
				}
			} catch {
				await instance.editReply(interaction, {
					content: instance.getMessage(interaction, 'BAD_VALUE', {
						VALUE: text,
					}),
				});
				return;
			}

			await instance.editReply(interaction, {
				content: `**${instance.getMessage(interaction, 'RESULT')}:** ${rolled}`,
			});
		} catch (error) {
			console.error(`roll: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
