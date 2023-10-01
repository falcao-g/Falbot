const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setNameLocalization('pt-BR', 'enquete')
		.setDescription('Create a little pretty poll')
		.setDescriptionLocalization('pt-BR', 'Crie uma bonita pequena enquete')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('theme')
				.setNameLocalization('pt-BR', 'tema')
				.setDescription('theme of the poll')
				.setDescriptionLocalization('pt-BR', 'tema da enquete')
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
