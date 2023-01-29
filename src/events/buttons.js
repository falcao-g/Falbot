const vote = require("../commands/vote")
const scratch = require("../commands/scratch")
const work = require("../commands/work")
const cooldowns = require("../commands/cooldowns")
const help = require("../commands/help")

module.exports = (client, instance) => {
	const { changeDB } = require("../utils/functions.js")
	const { MessageActionRow, MessageButton } = require("discord.js")
	client.on("interactionCreate", async (interaction) => {
		const { Falbot } = require("../../index.js")
		if (!interaction.isButton()) return

		guildUser = interaction.guild ? interaction.guild : interaction.user
		if (interaction.member) {
			guild = interaction.member.guild
		}
		user = interaction.user

		if (interaction.customId === "disableVoteReminder") {
			await interaction.deferReply({ ephemeral: true })
			await changeDB(interaction.user.id, "voteReminder", false, true)
			await changeDB(interaction.user.id, "lastReminder", 0, true)

			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("enableVoteReminder")
					.setLabel(Falbot.getMessage(guildUser, "ENABLE_REMINDER"))
					.setEmoji("🔔")
					.setStyle("PRIMARY")
			)

			interaction.editReply({
				content: Falbot.getMessage(guildUser, "REMINDER_DISABLED"),
				components: [row],
			})
		}

		if (interaction.customId === "enableVoteReminder") {
			await interaction.deferReply({ ephemeral: true })
			await changeDB(interaction.user.id, "voteReminder", true, true)

			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("disableVoteReminder")
					.setLabel(Falbot.getMessage(guildUser, "DISABLE_REMINDER"))
					.setEmoji("🔕")
					.setStyle("PRIMARY")
			)

			interaction.editReply({
				content: Falbot.getMessage(guildUser, "REMINDER_ENABLED"),
				components: [row],
			})
		}

		if (interaction.customId === "vote") {
			await vote.callback({ guild, user, interaction })
		}

		if (interaction.customId === "scratch") {
			await scratch.callback({ instance, guild, interaction, user })
		}

		if (interaction.customId === "work") {
			await work.callback({ instance, interaction, guild, user })
		}

		if (interaction.customId === "cooldowns") {
			await cooldowns.callback({ instance, guild, user, interaction })
		}

		if (interaction.customId === "help") {
			interaction.values = [null]
			await help.callback({ guild, interaction })
		}
	})
}
