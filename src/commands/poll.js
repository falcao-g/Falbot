const { getRoleColor } = require('../utils/functions.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
	execute: async ({ guild, interaction, user, member, instance }) => {
		try {
			await interaction.deferReply();
			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setDescription(interaction.options.getString('theme'))
				.setAuthor({
					name: instance.getMessage(interaction, 'ENQUETE', {
						USER: member.displayName,
					}),
					iconURL: user.avatarURL(),
				})
				.setFooter({ text: 'by Falcão ❤️' });

			answer = await interaction.editReply({
				embeds: [embed],
				fetchReply: true,
			});

			answer.react('👍');
			answer.react('👎');
		} catch (error) {
			console.error(`poll: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
