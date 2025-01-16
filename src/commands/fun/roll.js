const { Roll } = require('falgames');
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
				.setMaxLength(100)
		),
	execute: async ({ interaction, instance, member }) => {
		try {
			await interaction.deferReply().catch(() => {});
			new Roll({
				message: interaction,
				rollLimitMessage: instance.getMessage(interaction, 'ROLL_LIMIT'),
				rolledStringLimit: 1024,
				notValidRollMessage: instance.getMessage(interaction, 'BAD_VALUE'),
				isSlashGame: true,
				embed: {
					title: instance.getMessage(interaction, 'RESULT'),
					color: await instance.getUserDisplay('displayColor', member),
				},
			}).roll(interaction.options.getString('dice'));
		} catch (error) {
			console.error(`roll: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
