const { ButtonBuilder, ActionRowBuilder } = require("discord.js")
const { changeDB, readFile } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("reminder")
		.setDescription("Toggle your vote reminder")
		.setDMPermission(false),
	execute: async ({ guild, user, interaction, instance }) => {
		try {
			await interaction.deferReply({ ephemeral: true })
			if ((await readFile(user.id, "voteReminder")) === false) {
				await changeDB(user.id, "voteReminder", true, true)

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("disableVoteReminder")
						.setLabel(instance.getMessage(guild, "DISABLE_REMINDER"))
						.setEmoji("🔕")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(guild, "REMINDER_ENABLED"),
					components: [row],
				})
			} else {
				await changeDB(user.id, "voteReminder", false, true)
				await changeDB(user.id, "lastReminder", 0, true)

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("enableVoteReminder")
						.setLabel(instance.getMessage(guild, "ENABLE_REMINDER"))
						.setEmoji("🔔")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(guild, "REMINDER_DISABLED"),
					components: [row],
				})
			}
		} catch (error) {
			console.error(`reminder: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				components: [],
			})
		}
	},
}
