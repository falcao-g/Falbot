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
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			languageSchema = instance._mongoConnection.models["wokcommands-languages"]
			const lang = interaction.options.getString("language")
			if (guild) {
				if (!lang) {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "CURRENT_LANGUAGE", {
							LANGUAGE: Falbot.getLanguage(guild),
						}),
					})
					return
				}
				Falbot.setLanguage(guild, lang)

				await languageSchema.findOneAndUpdate(
					{
						_id: guild.id,
					},
					{
						_id: guild.id,
						language: lang,
					},
					{
						upsert: true,
					}
				)

				await interaction.editReply({
					content: Falbot.getMessage(guild, "NEW_LANGUAGE", {
						LANGUAGE: lang,
					}),
				})
			} else {
				if (!lang) {
					await interaction.editReply({
						content: Falbot.getMessage(user, "CURRENT_LANGUAGE", {
							LANGUAGE: Falbot.getLanguage(user),
						}),
					})
					return
				}
				Falbot.setLanguage(user, lang)

				await languageSchema.findOneAndUpdate(
					{
						_id: user.id,
					},
					{
						_id: user.id,
						language: lang,
					},
					{
						upsert: true,
					}
				)

				await interaction.editReply({
					content: Falbot.getMessage(user, "NEW_LANGUAGE", {
						LANGUAGE: lang,
					}),
				})
			}
		} catch (error) {
			console.error(`language: ${error}`)
		}
	},
}
