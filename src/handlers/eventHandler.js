async function loadEvents(instance, client) {
	const { loadFiles } = require("../utils/fileLoader")

	await client.events.clear()

	const Files = await loadFiles("events")

	Files.forEach((file) => {
		const event = require(file)

		const execute = (...args) => event.execute(...args, instance, client)
		client.events.set(event.name, execute)

		if (event.once) {
			client.once(event.name, execute)
		} else {
			client.on(event.name, execute)
		}

		console.log(`Event: ${event.name} ✅`)
	})
}

module.exports = { loadEvents }
