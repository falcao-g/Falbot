const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Checks the bot's ping.")
		.setDescriptionLocalization('pt-BR', 'Verifica o ping do bot.')
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		try {
			await interaction.deferReply().catch(() => {});

			answer = await instance.editReply(interaction, {
				content: `Pong! ${instance.client.ws.ping}ms`,
			});
		} catch (error) {
			console.error(`ping: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
