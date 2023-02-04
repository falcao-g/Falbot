async function loadEvents(instance, client) {
	const { loadFiles } = require("../utils/fileLoader")

	await client.events.clear()

	const Files = await loadFiles("events")

	Files.forEach((file) => {
		const event = require(file)

		//pass the falbot class here somehow
		const execute = (...args) => event.execute(...args, instance, client)
		client.events.set(event.name, execute)

		if (event.rest) {
			if (event.once) {
				client.rest.once(event.name, execute)
			} else {
				client.rest.on(event.name, execute)
			}
		} else {
			if (event.once) {
				client.once(event.name, execute)
			} else {
				client.on(event.name, execute)
			}
		}

		console.log(`Event: ${event.name} ✅`)
	})
}

module.exports = { loadEvents }
