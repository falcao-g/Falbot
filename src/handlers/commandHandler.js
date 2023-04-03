require("dotenv").config()

async function loadCommands(instance, client) {
	const { loadFiles } = require("../utils/fileLoader")

	await client.commands.clear()

	let commandsArray = []
	let commandsGuild = []

	const Files = await loadFiles("commands")

	Files.forEach((file) => {
		const command = require(file)
		client.commands.set(command.data.name, command)

		if (instance.config.testOnly || command.developer) {
			commandsGuild.push(command.data.toJSON())
		} else {
			commandsArray.push(command.data.toJSON())
		}

		console.log(`Command: ${command.data.name} ✅`)
	})

	client.application.commands.set(commandsArray)

	for (guild of instance.config.testGuilds) {
		client.application.commands.set(commandsGuild, guild)
	}
}

module.exports = { loadCommands }
