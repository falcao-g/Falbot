const { changeDB, resolveCooldown, msToTime, setCooldown } = require("../utils/functions.js")
const { ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
	name: "interactionCreate",
	execute: async (interaction, instance, client) => {
		if (interaction.user.bot) {
			interaction.reply({
				content: instance.getMessage(interaction, "YOU_ARE_BOT"),
				ephemeral: true,
			})
			return
		}

		if (instance._banned.includes(interaction.user.id)) {
			interaction.reply({
				content: instance.getMessage(interaction, "YOU_ARE_BANNED"),
				ephemeral: true,
			})
			return
		}

		if (interaction.guild != undefined) {
			var disabledChannels = instance._disabledChannels.get(interaction.guild.id)
			var disabledCommands = instance._disabledCommands.get(interaction.guild.id)
		}

		if (disabledChannels != undefined ? disabledChannels.includes(interaction.channel.id) : false) {
			interaction.reply({
				content: instance.getMessage(interaction, "THIS_CHANNEL_IS_DISABLED"),
				ephemeral: true,
			})
			return
		}

		if (
			disabledCommands != undefined
				? disabledCommands.includes(interaction.commandName ?? interaction.customId.split(" ")[0])
				: false
		) {
			interaction.reply({
				content: instance.getMessage(interaction, "THIS_COMMAND_IS_DISABLED"),
				ephemeral: true,
			})
			return
		}

		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			const command = client.commands.get(interaction.commandName)

			if (command.cooldown) {
				cooldown = await resolveCooldown(interaction.user.id, interaction.commandName)
				if (cooldown > 0) {
					await interaction.reply({
						content: instance.getMessage(guild, "COOLDOWN", {
							COOLDOWN: msToTime(cooldown),
						}),
						ephemeral: true,
					})
					return
				} else {
					await setCooldown(interaction.user.id, interaction.commandName, command.cooldown)
				}
			}

			if (command.developer && !instance.config.devs.includes(interaction.user.id)) {
				return interaction.reply({
					content: instance.getMessage(interaction.guild, "BOT_OWNERS_ONLY"),
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
			command.autocomplete({ client, interaction, instance })
		} else if (interaction.isButton()) {
			if (interaction.customId === "disableVoteReminder") {
				await interaction.deferReply({ ephemeral: true })
				await changeDB(interaction.user.id, "voteReminder", false, true)
				await changeDB(interaction.user.id, "lastReminder", 0, true)

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("enableVoteReminder")
						.setLabel(instance.getMessage(interaction, "ENABLE_REMINDER"))
						.setEmoji("🔔")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(interaction, "REMINDER_DISABLED"),
					components: [row],
				})
			}

			if (interaction.customId === "enableVoteReminder") {
				await interaction.deferReply({ ephemeral: true })
				await changeDB(interaction.user.id, "voteReminder", true, true)

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("disableVoteReminder")
						.setLabel(instance.getMessage(interaction, "DISABLE_REMINDER"))
						.setEmoji("🔕")
						.setStyle("Primary")
				)

				interaction.editReply({
					content: instance.getMessage(interaction, "REMINDER_ENABLED"),
					components: [row],
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

			if (
				interaction.customId === "inventory view" ||
				interaction.customId === "inventory craft" ||
				interaction.customId.startsWith("craft")
			) {
				if (!interaction.customId.startsWith("craft")) {
					var arguments = interaction.customId.split(" ")
				} else {
					var arguments = ["inventory", "craft"]
				}
				const inventory = client.commands.get(arguments[0])
				await inventory.execute({
					guild: interaction.guild,
					interaction,
					instance,
					member: interaction.member,
					subcommand: arguments[1],
				})
			}

			if (interaction.customId.startsWith("next") || interaction.customId.startsWith("previous")) {
				const iteminfo = client.commands.get("iteminfo")
				await iteminfo.execute({
					guild: interaction.guild,
					interaction,
					instance,
					member: interaction.member,
				})
			}

			if (
				interaction.customId === "vote" ||
				interaction.customId === "scratch" ||
				interaction.customId === "work" ||
				interaction.customId === "cooldowns" ||
				interaction.customId === "fish" ||
				interaction.customId === "explore" ||
				interaction.customId === "mine" ||
				interaction.customId === "hunt" ||
				interaction.customId === "balance"
			) {
				const command = client.commands.get(interaction.customId)

				if (command.cooldown) {
					cooldown = await resolveCooldown(interaction.user.id, interaction.customId)
					if (cooldown > 0) {
						await interaction.reply({
							content: instance.getMessage(guild, "COOLDOWN", {
								COOLDOWN: msToTime(cooldown),
							}),
							ephemeral: true,
						})
						return
					} else {
						await setCooldown(interaction.user.id, interaction.customId, command.cooldown)
					}
				}

				await command.execute({
					guild: interaction.guild,
					user: interaction.user,
					interaction,
					instance,
					member: interaction.member,
				})
			}
		} else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === "page") {
				const help = client.commands.get("help")
				help.execute({ guild: interaction.guild, interaction, instance })
			}

			if (interaction.customId === "craft") {
				const inventory = client.commands.get("inventory")
				await inventory.execute({
					guild: interaction.guild,
					interaction,
					instance,
					member: interaction.member,
					subcommand: "craft",
				})
			}
		}
	},
}
