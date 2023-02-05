const { EmbedBuilder } = require("discord.js")
const {
	readFile,
	changeDB,
	getRoleColor,
	randint,
	format,
	msToTime,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("work")
		.setDescription("Go to work to earn money")
		.setDMPermission(false),
	execute: async ({ interaction, instance, guild, user }) => {
		try {
			await interaction.deferReply()
			var workCooldown = await instance.coolSchema.findById(`work-${user.id}`)
			var levels = instance.levels

			if (workCooldown) {
				await interaction.editReply({
					content: instance.getMessage(guild, "COOLDOWN", {
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
			desc = instance.getMessage(guild, "WORK", {
				FALCOINS: format(salary),
			})
			luck = randint(0, 100)

			if (luck <= 25) {
				bonus = salary * 2
				desc +=
					"\n" +
					instance.getMessage(guild, "BONUS", {
						FALCOINS: format(bonus),
					})
			}

			changeDB(user.id, "falcoins", salary + bonus)

			var embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setTitle(
					instance.getMessage(guild, "WORK_TITLE", {
						FALCOINS: format(salary + bonus),
					})
				)
				.setDescription(desc)
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({
				embeds: [embed],
			})

			await new instance.coolSchema({
				_id: `work-${user.id}`,
				name: "work",
				type: "per-user",
				cooldown: 60 * 60,
			}).save()
		} catch (err) {
			console.error(`work: ${err}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
