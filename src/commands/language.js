module.exports = {
	category: "uteis",
	description: "Sets the language of the server or the user",
	slash: true,
	cooldown: "1s",
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
						content: instance.messageHandler.get(guild, "CURRENT_LANGUAGE", {
							LANGUAGE: instance.messageHandler.getLanguage(guild),
						}),
					})
					return
				}
				instance.messageHandler.setLanguage(guild, lang)

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
					content: instance.messageHandler.get(guild, "NEW_LANGUAGE", {
						LANGUAGE: lang,
					}),
				})
			} else {
				if (!lang) {
					await interaction.editReply({
						content: instance.messageHandler.get(user, "CURRENT_LANGUAGE", {
							LANGUAGE: instance.messageHandler.getLanguage(user),
						}),
					})
					return
				}
				instance.messageHandler.setLanguage(user, lang)

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
					content: instance.messageHandler.get(user, "NEW_LANGUAGE", {
						LANGUAGE: lang,
					}),
				})
			}
		} catch (error) {
			console.error(`language: ${error}`)
		}
	},
}
