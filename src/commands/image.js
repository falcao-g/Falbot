const { MessageEmbed } = require("discord.js")
const { GOOGLE_IMG_SCRAP } = require("google-img-scrap")
const { randint, getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Fun",
	description: "Show a random image from google based on the search query",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "search",
			description: "the search query",
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ message, interaction, user, guild, text }) => {
		try {
			await interaction.deferReply()

			text = text.trim()

			const photos = await GOOGLE_IMG_SCRAP({
				search: text,
				limit: 100,
				safeSearch: true,
			})

			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setTitle(`${text}`)
				.setImage(photos.result[randint(0, photos.result.length - 1)].url)
				.setFooter({ text: "by Falcão ❤️" })

			interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`image: ${error}`)
		}
	},
}
