const { changeDB } = require("../utils/functions.js")
const { ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
	name: "interactionCreate",
	execute: async (interaction, instance, client) => {
		guildUser = interaction.guild ? interaction.guild : interaction.user

		if (interaction.user.bot) {
			interaction.reply({
				content: instance.getMessage(guildUser, "YOU_ARE_BOT"),
				ephemeral: true,
			})
			return
		}

		if (instance._banned.includes(interaction.user.id)) {
			interaction.reply({
				content: instance.getMessage(guildUser, "YOU_ARE_BANNED"),
				ephemeral: true,
			})
			return
		}

		if (
			instance._disabledChannels
				.get(interaction.guild.id)
				.includes(interaction.channel.id)
		) {
			interaction.reply({
				content: instance.getMessage(guildUser, "THIS_CHANNEL_IS_DISABLED"),
				ephemeral: true,
			})
			return
		}

		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			const command = client.commands.get(interaction.commandName)

			if (
				command.developer &&
				!instance.config.devs.includes(interaction.user.id)
			) {
				return interaction.reply({
					content: instance.getMessage(guildUser, "BOT_OWNERS_ONLY"),
					ephemeral: true,
				})
			}
			command.execute({
				interaction,
				instance,
				client,
				member: interaction.member,
				guild: interaction.guild,
				user: interaction.user,
				channel: interaction.channel,
			})
		} else if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName)
			command.autocomplete({ interaction, instance })
		} else if (interaction.isButton()) {
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
				await vote.execute({
					guild: interaction.guild,
					user: interaction.user,
					interaction,
					instance,
				})
			}

			if (interaction.customId === "scratch") {
				const scratch = client.commands.get("scratch")
				await scratch.execute({
					guild: interaction.guild,
					interaction,
					user: interaction.user,
					instance,
				})
			}

			if (interaction.customId === "work") {
				const work = client.commands.get("work")
				await work.execute({
					interaction,
					guild: interaction.guild,
					user: interaction.user,
					instance,
				})
			}

			if (interaction.customId === "cooldowns") {
				const cooldowns = client.commands.get("cooldowns")
				await cooldowns.execute({
					guild: interaction.guild,
					user: interaction.user,
					interaction,
					instance,
				})
			}

			if (interaction.customId === "help") {
				interaction.values = [null]
				const help = client.commands.get("help")
				await help.execute({
					guild: interaction.guild,
					interaction,
					instance,
				})
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === "page") {
				const help = client.commands.get("help")
				help.execute({ guild: interaction.guild, interaction, instance })
			}
		}
	},
}
