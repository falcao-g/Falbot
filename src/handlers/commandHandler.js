require("dotenv").config()

async function loadCommands(instance, client) {
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

module.exports = { loadCommands }
