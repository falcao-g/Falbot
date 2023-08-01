const { ButtonBuilder, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const { changeDB, readFile } = require('../utils/functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setNameLocalization('pt-BR', 'lembrete')
		.setDescription('Toggle your vote reminder')
		.setDescriptionLocalization('pt-BR', 'Liga/desliga seu lembrete para votar')
		.setDMPermission(false),
	execute: async ({ user, interaction, instance }) => {
		try {
			await interaction.deferReply({ ephemeral: true }).catch(() => {});
			if ((await readFile(user.id, 'voteReminder')) === false) {
				await changeDB(user.id, 'voteReminder', true, true);

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('disableVoteReminder')
						.setLabel(instance.getMessage(interaction, 'DISABLE_REMINDER'))
						.setEmoji('🔕')
						.setStyle('Primary')
				);

				interaction.editReply({
					content: instance.getMessage(interaction, 'REMINDER_ENABLED'),
					components: [row],
				});
			} else {
				await changeDB(user.id, 'voteReminder', false, true);
				await changeDB(user.id, 'lastReminder', 0, true);

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('enableVoteReminder')
						.setLabel(instance.getMessage(interaction, 'ENABLE_REMINDER'))
						.setEmoji('🔔')
						.setStyle('Primary')
				);

				interaction.editReply({
					content: instance.getMessage(interaction, 'REMINDER_DISABLED'),
					components: [row],
				});
			}
		} catch (error) {
			console.error(`reminder: ${error}`);
			interaction.editReply({
				content: instance.getMessage(interaction, 'EXCEPTION'),
				components: [],
			});
		}
	},
};
