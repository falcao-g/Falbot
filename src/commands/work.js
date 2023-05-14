const {
	readFile,
	changeDB,
	getRoleColor,
	randint,
	format,
	setCooldown,
} = require("../utils/functions.js")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	cooldown: true,
	data: new SlashCommandBuilder()
		.setName("work")
		.setNameLocalization("pt-BR", "trabalhar")
		.setDescription("Go to work to earn falcoins")
		.setDescriptionLocalization("pt-BR", "Vá trabalhar para ganhar falcoins")
		.setDMPermission(false),
	execute: async ({ interaction, instance, guild, user }) => {
		try {
			await interaction.deferReply()
			var levels = instance.levels

			var rank_number = await readFile(user.id, "rank")
			var min = levels[rank_number - 1].work[0]
			var max = levels[rank_number - 1].work[1]
			var salary = randint(min, max)

			let bonus = 0
			desc = instance.getMessage(guild, "WORK", {
				FALCOINS: format(salary),
			})
			luck = randint(0, 100)

			if (luck <= 30) {
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

			setCooldown(user.id, "work", 60 * 60)
		} catch (err) {
			console.error(`work: ${err}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
