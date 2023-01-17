const vote = require("../commands/vote")
const scratch = require("../commands/scratch")
const work = require("../commands/work")

module.exports = (client, instance) => {
	const { changeDB } = require("../utils/functions.js")
	const { MessageActionRow, MessageButton } = require("discord.js")
	client.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.isButton()) return

			guildUser = interaction.guild ? interaction.guild : interaction.user
			guild = interaction.member.guild
			user = interaction.user

			if (interaction.customId === "disableVoteReminder") {
				await interaction.deferReply({ ephemeral: true })
				await changeDB(interaction.user.id, "voteReminder", false, true)
				await changeDB(interaction.user.id, "lastReminder", 0, true)

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("enableVoteReminder")
						.setLabel(instance.messageHandler.get(guildUser, "ENABLE_REMINDER"))
						.setEmoji("🔔")
						.setStyle("PRIMARY")
				)

				interaction.editReply({
					content: instance.messageHandler.get(guildUser, "REMINDER_DISABLED"),
					components: [row],
				})
			}

			if (interaction.customId === "enableVoteReminder") {
				await interaction.deferReply({ ephemeral: true })
				await changeDB(interaction.user.id, "voteReminder", true, true)

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("disableVoteReminder")
						.setLabel(
							instance.messageHandler.get(guildUser, "DISABLE_REMINDER")
						)
						.setEmoji("🔕")
						.setStyle("PRIMARY")
				)

				interaction.editReply({
					content: instance.messageHandler.get(guildUser, "REMINDER_ENABLED"),
					components: [row],
				})
			}

			if (interaction.customId === "vote") {
				await vote.callback({ instance, guild, user, interaction })
			}

			if (interaction.customId === "scratch") {
				await scratch.callback({ instance, guild, interaction, user })
			}

			if (interaction.customId === "work") {
				await work.callback({ instance, interaction, guild, user })
			}
		} catch (error) {
			console.error(`Button: ${error}`)
		}
	})
}
