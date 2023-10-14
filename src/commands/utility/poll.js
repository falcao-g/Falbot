const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setNameLocalizations({
			'pt-BR': 'enquete',
			'es-ES': 'encuesta',
		})
		.setDescription('Create a little pretty poll')
		.setDescriptionLocalizations({
			'pt-BR': 'Crie uma bonita pequena enquete',
			'es-ES': 'Crea una bonita pequeña encuesta',
		})
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('theme')
				.setNameLocalizations({
					'pt-BR': 'tema',
					'es-ES': 'tema',
				})
				.setDescription('theme of the poll')
				.setDescriptionLocalizations({
					'pt-BR': 'tema da enquete',
					'es-ES': 'tema de la encuesta',
				})
				.setRequired(true)
		),
	execute: async ({ interaction, user, member, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});
			const embed = instance
				.createEmbed(member.displayColor)
				.setDescription(interaction.options.getString('theme'))
				.setAuthor({
					name: instance.getMessage(interaction, 'ENQUETE', {
						USER: member.displayName,
					}),
					iconURL: user.avatarURL(),
				});

			answer = await instance.editReply(interaction, {
				embeds: [embed],
				fetchReply: true,
			});

			answer.react('👍');
			answer.react('👎');
		} catch (error) {
			console.error(`poll: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
