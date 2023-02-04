const { EmbedBuilder } = require("discord.js")
const { GOOGLE_IMG_SCRAP } = require("google-img-scrap")
const { randint, getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("image")
		.setDescription("Show a random image from google based on the search query")
		.addStringOption((option) =>
			option
				.setName("search")
				.setDescription("the search query")
				.setRequired(true)
		),
	execute: async ({ interaction, user, guild }) => {
		await interaction.deferReply()
		try {
			var text = interaction.options.getString("search").trim()

			const photos = await GOOGLE_IMG_SCRAP({
				search: text,
				limit: 100,
				safeSearch: true,
			})

			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setTitle(`${text}`)
				.setImage(photos.result[randint(0, photos.result.length - 1)].url)
				.setFooter({ text: "by Falcão ❤️" })

			interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`image: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
