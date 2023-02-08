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
	client.application.commands.set(commandsGuild, instance.config.testGuild)

	if (commandsArray.length > 0) {
		fetch(
			`https://discordbotlist.com/api/v1/bots/${instance.config.botId}/commands`,
			{
				method: "POST",
				headers: {
					Authorization: process.env.Authorization2,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(commandsArray),
			}
		)
			.then((response) => response.json())
			.then((response) => console.log(JSON.stringify(response)))
	}
}

module.exports = { loadCommands }
