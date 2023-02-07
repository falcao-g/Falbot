module.exports = {
	name: "interactionCreate",
	execute: async (interaction, instance, client) => {
		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			if (interaction.guild) {
				var guildUser = interaction.guild
			} else {
				var guildUser = interaction.user
			}

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
		}
	},
}
