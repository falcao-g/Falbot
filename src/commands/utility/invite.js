const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setNameLocalizations({
			'pt-BR': 'convite',
			'es-ES': 'invitación',
		})
		.setDescription('Get a invite to invite the bot and to join our support server')
		.setDescriptionLocalizations({
			'pt-BR': 'Obtenha um convite para convidar o bot e para entrar em nosso servidor de suporte',
			'es-ES': 'Obtén una invitación para invitar al bot y para unirte a nuestro servidor de soporte',
		})
		.setDMPermission(false),
	execute: async ({ interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			await instance.editReply(interaction, { content: instance.getMessage(interaction, 'INVITE') });
		} catch (error) {
			console.error(`botinfo: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
			});
		}
	},
};
