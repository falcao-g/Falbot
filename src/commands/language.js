const { Falbot } = require("../../index.js")

module.exports = {
	description: "Sets the language of the server or the user",
	slash: true,
	guildOnly: false,
	permissions: ["ADMINISTRATOR"],
	options: [
		{
			name: "language",
			description: "the desired language of the server or the user",
			required: false,
			type: "STRING",
			choices: [
				{ name: "português", value: "portugues" },
				{ name: "english", value: "english" },
			],
		},
	],
	callback: async ({ guild, user, interaction }) => {
		await interaction.deferReply()
		try {
			const lang = interaction.options.getString("language")
			guildUser = guild ? guild : user
			if (!lang) {
				await interaction.editReply({
					content: Falbot.getMessage(guildUser, "CURRENT_LANGUAGE", {
						LANGUAGE: Falbot.getLanguage(guildUser),
					}),
				})
				return
			}
			Falbot.setLanguage(guildUser, lang)

			await Falbot.langSchema.findOneAndUpdate(
				{
					_id: guildUser.id,
				},
				{
					_id: guildUser.id,
					language: lang,
				},
				{
					upsert: true,
				}
			)

			await interaction.editReply({
				content: Falbot.getMessage(guildUser, "NEW_LANGUAGE", {
					LANGUAGE: lang,
				}),
			})
		} catch (error) {
			console.error(`language: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
