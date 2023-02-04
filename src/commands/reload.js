const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const { loadCommands } = require("../handlers/commandHandler")
const { loadEvents } = require("../handlers/eventHandler")

module.exports = {
	developer: true,
	data: new SlashCommandBuilder()
		.setName("reload")
		.setDescription("reload your commands/events")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((options) =>
			options.setName("events").setDescription("reload your events")
		)
		.addSubcommand((options) =>
			options.setName("commands").setDescription("reload your commands")
		),
	execute({ interaction, client }) {
		const subCommand = interaction.options.getSubcommand()

		if (subCommand === "events") {
			for (const [key, value] of client.events) {
				client.removeListener(`${key}`, value, true)
			}
			loadEvents(client)
			interaction.reply({ content: "events reloaded" })
		} else {
			loadCommands(client)
			interaction.reply({ content: "commands reloaded" })
		}
	},
}
