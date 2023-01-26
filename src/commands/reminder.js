const { MessageButton, MessageActionRow } = require("discord.js")
const { changeDB, readFile } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Toggle your vote reminder",
	slash: true,
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply({ ephemeral: true })
			if ((await readFile(user.id, "voteReminder")) === false) {
				await changeDB(user.id, "voteReminder", true, true)

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("disableVoteReminder")
						.setLabel(instance.messageHandler.get(guild, "DISABLE_REMINDER"))
						.setEmoji("🔕")
						.setStyle("PRIMARY")
				)

				interaction.editReply({
					content: instance.messageHandler.get(guild, "REMINDER_ENABLED"),
					components: [row],
				})
			} else {
				await changeDB(user.id, "voteReminder", false, true)
				await changeDB(user.id, "lastReminder", 0, true)

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("enableVoteReminder")
						.setLabel(instance.messageHandler.get(guild, "ENABLE_REMINDER"))
						.setEmoji("🔔")
						.setStyle("PRIMARY")
				)

				interaction.editReply({
					content: instance.messageHandler.get(guild, "REMINDER_DISABLED"),
					components: [row],
				})
			}
		} catch (error) {
			console.error(`reminder: ${error}`)
		}
	},
}
