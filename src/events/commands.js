module.exports = {
	name: "interactionCreate",
	execute(interaction, instance, client) {
		if (
			!interaction.isChatInputCommand() &&
			!interaction.isContextMenuCommand()
		)
			return

		const command = client.commands.get(interaction.commandName)
		if (!command)
			return interaction.reply({ content: "This command fucking died" })

		if (
			command.developer &&
			!instance.config.devs.includes(interaction.user.id)
		)
			return interaction.reply({ content: "DENIED" })

		command.execute({
			interaction,
			instance,
			client,
			member: interaction.member,
			guild: interaction.guild,
			user: interaction.user,
			channel: interaction.channel,
		})
	},
}
