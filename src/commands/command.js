const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("command")
		.setNameLocalization("pt-BR", "comando")
		.setDescription("Configure disabled commands in your server, Falbot respond to this commands")
		.setDescriptionLocalization(
			"pt-BR",
			"Desative/reative comandos no seu servidor, o Falbot não irá responder a esses comandos"
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("disable")
				.setNameLocalization("pt-BR", "desativar")
				.setDescription("Falbot will not respond to the selected command")
				.setDescriptionLocalization("pt-BR", "Falbot não irá responder ao comando escolhido")
				.addStringOption((option) =>
					option
						.setName("command")
						.setNameLocalization("pt-BR", "comando")
						.setDescription("command to be deactivated")
						.setDescriptionLocalization("pt-BR", "comando para ser desativado")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("enable")
				.setNameLocalization("pt-BR", "reativar")
				.setDescription("Falbot will return responding to the command")
				.setDescriptionLocalization("pt-BR", "Falbot voltará à responder ao comando escolhido")
				.addStringOption((option) =>
					option
						.setName("command")
						.setNameLocalization("pt-BR", "comando")
						.setDescription("command to be deactivated")
						.setDescriptionLocalization("pt-BR", "comando para ser reativado")
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	execute: async ({ client, guild, interaction, instance }) => {
		await interaction.deferReply({ ephemeral: true })
		try {
			var commands = client.commands
				.map((command) => {
					var names = [command.data.name]
					if (command.data.name_localizations)
						Object.values(command.data.name_localizations).forEach((name) => {
							names.push(name)
						})
					return names
				})
				.filter((names) => !names.includes("command"))
			const subcommand = interaction.options.getSubcommand()
			const argument = interaction.options.getString("command")
			const command = commands.find((names) => {
				if (names.includes(argument)) return names
			})

			if (!command) {
				return interaction.editReply(instance.getMessage(interaction, "INVALID_COMMAND"))
			}

			if (subcommand === "disable") {
				instance.disableCommand(guild, command[0])

				await instance.guildsSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						$push: { disabledCommands: command[0] },
					},
					{
						upsert: true,
					}
				)
				interaction.editReply(instance.getMessage(interaction, "DISABLED", { NAME: command[0] }))
			} else {
				instance.enableCommand(guild, command[0])

				await instance.guildsSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						$pull: { disabledCommands: command[0] },
					},
					{
						upsert: true,
					}
				)

				interaction.editReply(instance.getMessage(interaction, "ENABLED", { NAME: command[0] }))
			}
		} catch (error) {
			console.error(`command: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "EXCEPTION"),
			})
		}
	},
	autocomplete: async ({ client, interaction, instance }) => {
		const focusedValue = interaction.options.getFocused().toLowerCase()
		try {
			const commands = client.commands
				.map((command) => {
					if (!command.data.name_localizations) return command.data.name
					return command.data.name_localizations[interaction.locale] ?? command.data.name_localizations["en-US"]
				})
				.filter((name) => name !== "command" && name !== "comando" && name != "tools")
			const filtered = commands.filter((choice) => choice.startsWith(focusedValue))
			await interaction.respond([
				{
					name: filtered[0],
					value: filtered[0],
				},
			])
		} catch {
			await interaction.respond([
				{
					name: instance.getMessage(interaction, "INVALID_COMMAND"),
					value: focusedValue,
				},
			])
		}
	},
}
