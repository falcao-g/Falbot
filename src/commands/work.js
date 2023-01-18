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
	callback: async ({ instance, interaction, guild, user }) => {
		try {
			await interaction.deferReply()

			cooldownsSchema =
				instance._mongoConnection.models["wokcommands-cooldowns"]
			workCooldown = await cooldownsSchema.findById(
				`work-${guild.id}-${user.id}`
			)

			if (workCooldown) {
				await interaction.editReply({
					content: instance.messageHandler.get(guild, "COOLDOWN", {
						COOLDOWN: await msToTime(workCooldown.cooldown * 1000),
					}),
				})
				return
			}

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

			await interaction.editReply({
				embeds: [embed],
			})

			await new cooldownsSchema({
				_id: `work-${guild.id}-${user.id}`,
				name: "work",
				type: "per-user",
				cooldown: 60 * 60,
			}).save()
		} catch (err) {
			console.error(`work: ${err}`)
		}
	},
}
