async function loadCommands(client) {
	const { loadFiles } = require("../utils/fileLoader")

	await client.commands.clear()

	let commandsArray = []

	const Files = await loadFiles("commands")

	Files.forEach((file) => {
		//testOnly need implementation yet
		//developer commands should only be visible in the servers
		const command = require(file)
		client.commands.set(command.data.name, command)

		commandsArray.push(command.data.toJSON())

		console.log(`Command: ${command.data.name} ✅`)
	})

	client.application.commands.set(commandsArray)
}

module.exports = { loadCommands }
