const { changeDB } = require("../utils/functions.js")
const { ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
	name: "interactionCreate",
	execute: async (interaction, instance, client) => {
		try {
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

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("enableVoteReminder")
						.setLabel(instance.getMessage(guildUser, "ENABLE_REMINDER"))
						.setEmoji("🔔")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(guildUser, "REMINDER_DISABLED"),
					components: [row],
				})
			}

			if (interaction.customId === "enableVoteReminder") {
				await interaction.deferReply({ ephemeral: true })
				await changeDB(interaction.user.id, "voteReminder", true, true)

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("disableVoteReminder")
						.setLabel(instance.getMessage(guildUser, "DISABLE_REMINDER"))
						.setEmoji("🔕")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(guildUser, "REMINDER_ENABLED"),
					components: [row],
				})
			}

			if (interaction.customId === "vote") {
				const vote = client.commands.get("vote")
				await vote.execute({ guild, user, interaction, instance })
			}

			if (interaction.customId === "scratch") {
				const scratch = client.commands.get("scratch")
				await scratch.execute({ guild, interaction, user, instance })
			}

			if (interaction.customId === "work") {
				const work = client.commands.get("work")
				await work.execute({ interaction, guild, user, instance })
			}

			if (interaction.customId === "cooldowns") {
				const cooldowns = client.commands.get("cooldowns")
				await cooldowns.execute({ guild, user, interaction, instance })
			}

			if (interaction.customId === "help") {
				interaction.values = [null]
				const help = client.commands.get("help")
				await help.execute({ guild, interaction, instance })
			}
		} catch (error) {
			console.error(`Buttons: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				components: [],
			})
		}
	},
}
