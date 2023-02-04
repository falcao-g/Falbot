module.exports = {
	name: "interactionCreate",
	execute: async (interaction, instance, client) => {
		try {
			if (!interaction.isStringSelectMenu()) return

			if (interaction.customId === "page") {
				guild = interaction.member.guild
				const help = client.commands.get("help")
				help.execute({ guild, interaction, instance })
			}
		} catch (error) {
			console.error(`Select: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
