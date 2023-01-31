const { MessageEmbed } = require("discord.js")
const {
	readFile,
	changeDB,
	getRoleColor,
	randint,
	format,
	msToTime,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const levels = require("../utils/json/levels.json")

module.exports = {
	description: "Go to work to earn money",
	slash: true,
	guildOnly: true,
	testOnly,
	init: () => {
		const { Falbot } = require("../../index.js")
	},
	callback: async ({ interaction, guild, user }) => {
		try {
			await interaction.deferReply()
			workCooldown = await Falbot.coolSchema.findById(`work-${user.id}`)

			if (workCooldown) {
				await interaction.editReply({
					content: Falbot.getMessage(guild, "COOLDOWN", {
						COOLDOWN: msToTime(workCooldown.cooldown * 1000),
					}),
				})
				return
			}

			var rank_number = await readFile(user.id, "rank")
			var min = levels[rank_number - 1].work[0]
			var max = levels[rank_number - 1].work[1]
			var salary = randint(min, max)

			let bonus = 0
			desc = Falbot.getMessage(guild, "WORK", {
				FALCOINS: format(salary),
			})
			luck = randint(0, 100)

			if (luck <= 20) {
				bonus = salary * 3
				desc +=
					"\n" +
					Falbot.getMessage(guild, "BONUS", {
						FALCOINS: format(bonus),
					})
			}

			changeDB(user.id, "falcoins", salary + bonus)

			var embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setTitle(
					Falbot.getMessage(guild, "WORK_TITLE", {
						FALCOINS: format(salary + bonus),
					})
				)
				.setDescription(desc)
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({
				embeds: [embed],
			})

			await new Falbot.coolSchema({
				_id: `work-${user.id}`,
				name: "work",
				type: "per-user",
				cooldown: 60 * 60,
			}).save()
		} catch (err) {
			console.error(`work: ${err}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
