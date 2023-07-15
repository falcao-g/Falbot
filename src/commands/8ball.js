const { randint } = require('../utils/functions.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setNameLocalization('pt-BR', 'bola8')
		.setDescription('Forecast your future')
		.setDescriptionLocalization('pt-BR', 'Preveja seu futuro')
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName('question')
				.setNameLocalization('pt-BR', 'pergunta')
				.setDescription('the question you want to ask the 8ball')
				.setDescriptionLocalization('pt-BR', 'a pergunta que a bola8 deve responder')
				.setRequired(true)
		),
	execute: async ({ interaction, instance }) => {
		await interaction.deferReply();
		try {
			const answers = instance.getMessage(interaction, '8BALL');
			const answer = `${answers[randint(0, answers.length - 1)]}`;
			const embed = new EmbedBuilder()
				.setColor(2303786)
				.setAuthor({
					name: instance.getMessage(interaction, 'BOLA8'),
					iconURL: 'https://images.emojiterra.com/google/noto-emoji/unicode-13.1/128px/1f3b1.png',
				})
				.addFields(
					{
						name: instance.getMessage(interaction, 'PERGUNTA'),
						value: interaction.options.getString('question'),
					},
					{
						name: instance.getMessage(interaction, 'PREVISAO'),
						value: answer,
					}
				)
				.setFooter({ text: 'by Falcão ❤️' });
			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			console.error(`8ball: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
