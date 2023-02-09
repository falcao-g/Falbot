const { EmbedBuilder } = require("discord.js")
const { GOOGLE_IMG_SCRAP } = require("google-img-scrap")
const { randint, getRoleColor } = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("image")
		.setNameLocalization("pt-BR", "imagem")
		.setDescription("Show a imagem from google photos based on your search")
		.setDescriptionLocalization(
			"pt-BR",
			"Mostra uma imagem do google fotos de acordo com a sua pesquisa"
		)
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("search")
				.setNameLocalization("pt-BR", "pesquisa")
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
