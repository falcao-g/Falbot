const { readFile, changeDB, msToTime } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Claim your lootbox (available every 12 hours)",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user }) => {
		try {
			if (Date.now() - (await readFile(user.id, "lastLootbox")) < 43200000) {
				return instance.messageHandler.get(guild, "COOLDOWN", {
					COOLDOWN: await msToTime(
						43200000 - (Date.now() - (await readFile(user.id, "lastLootbox")))
					),
				})
			}
			const quantity = await readFile(user.id, "lootbox")
			changeDB(user.id, "falcoins", quantity)
			changeDB(user.id, "lastLootbox", Date.now(), true)
			return instance.messageHandler.get(guild, "LOOTBOX", {
				FALCOINS: quantity,
			})
		} catch (error) {
			console.error(`lootbox: ${error}`)
		}
	},
}
