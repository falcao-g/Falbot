const { MessageButton, MessageActionRow } = require("discord.js")
const { changeDB, readFile } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "uteis",
	description: "Toggle your vote reminder",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			if ((await readFile(user.id, "voteReminder")) === false) {
				await changeDB(user.id, "voteReminder", true, true)

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("disableVoteReminder")
						.setLabel(instance.messageHandler.get(guild, "DISABLE_REMINDER"))
						.setEmoji("🔕")
						.setStyle("PRIMARY")
				)

				interaction.reply({
					content: instance.messageHandler.get(guild, "REMINDER_ENABLED"),
					ephemeral: true,
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

				interaction.reply({
					content: instance.messageHandler.get(guild, "REMINDER_DISABLED"),
					ephemeral: true,
					components: [row],
				})
			}
		} catch (error) {
			console.error(`reminder: ${error}`)
		}
	},
}
