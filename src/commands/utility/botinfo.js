const { msToTime } = require('../../utils/functions.js');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Check some bot stats')
		.setDescriptionLocalizations({
			'pt-BR': 'Veja algumas estatísticas do bot',
			'es-ES': 'Mira algunas estadísticas del bot',
		})
		.setDMPermission(false),
	execute: async ({ client, interaction, instance }) => {
		await interaction.deferReply().catch(() => {});
		try {
			const embed = instance.createEmbed(3426654).addFields({
				name: 'Falbot info',
				value: `**:earth_americas: [Site](https://falbot.netlify.app/) :robot: [Github](https://github.com/falcao-g/Falbot) :butterfly: [Bluesky](https://bsky.app/profile/falbot.bsky.social) :crown: [Patreon](https://www.patreon.com/Falbot)\n:house: ${instance.getMessage(
					interaction,
					'SERVERS'
				)}: ${client.guilds.cache.size}\n:busts_in_silhouette: ${instance.getMessage(interaction, 'TOTAL_PLAYERS')}: ${
					(await instance.userSchema.find({})).length
				}\n:speaking_head: ${instance.getMessage(interaction, 'ACTIVE_PLAYERS')}: ${
					(await instance.userSchema.find({ updatedAt: { $gte: new Date(Date.now() - 2592000000) } })).length
				}\n:zap: ${instance.getMessage(interaction, 'UPTIME')}: ${msToTime(client.uptime)}**`,
			});
			await instance.editReply(interaction, { embeds: [embed] });
		} catch (error) {
			console.error(`botinfo: ${error}`);
			instance.editReply(interaction, {
				content: instance.getMessage(interaction, 'EXCEPTION'),
				embeds: [],
			});
		}
	},
};
