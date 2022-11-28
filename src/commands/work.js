const { MessageEmbed } = require("discord.js")
const {
	readFile,
	changeDB,
	getRoleColor,
	randint,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const levels = require("../utils/json/levels.json")

module.exports = {
	category: "Economia",
	description: "Go to work to earn money",
	slash: true,
	cooldown: "1h",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, user }) => {
		try {
			var rank_number = await readFile(user.id, "rank")
			var min = levels[rank_number - 1].work[0]
			var max = levels[rank_number - 1].work[1]
			var salary = randint(min, max)

			let bonus = 0
			desc = instance.messageHandler.get(guild, "WORK", {
				FALCOINS: await format(salary),
			})
			luck = randint(0, 100)

			if (luck <= 20) {
				bonus = salary * 3
				desc +=
					"\n" +
					instance.messageHandler.get(guild, "BONUS", {
						FALCOINS: await format(bonus),
					})
			}

			changeDB(user.id, "falcoins", salary + bonus)

			var embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setTitle(
					instance.messageHandler.get(guild, "WORK_TITLE", {
						FALCOINS: await format(salary + bonus),
					})
				)
				.setDescription(desc)
				.setFooter({ text: "by Falcão ❤️" })

			return embed
		} catch (err) {
			console.error(`work: ${err}`)
		}
	},
}
