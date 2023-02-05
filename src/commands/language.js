const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("language")
		.setDescription("Sets the language of the server or the user")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("the desired language of the server or the user")
				.setRequired(false)
				.addChoices(
					{ name: "português", value: "portugues" },
					{ name: "english", value: "english" }
				)
		),
	execute: async ({ guild, user, interaction, instance }) => {
		await interaction.deferReply()
		try {
			const lang = interaction.options.getString("language")
			guildUser = guild ? guild : user
			if (!lang) {
				await interaction.editReply({
					content: instance.getMessage(guildUser, "CURRENT_LANGUAGE", {
						LANGUAGE: instance.getLanguage(guildUser),
					}),
				})
				return
			}
			instance.setLanguage(guildUser, lang)

			await instance.langSchema.findOneAndUpdate(
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
				content: instance.getMessage(guildUser, "NEW_LANGUAGE", {
					LANGUAGE: lang,
				}),
			})
		} catch (error) {
			console.error(`language: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
