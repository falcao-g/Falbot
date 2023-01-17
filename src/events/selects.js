const help = require("../commands/help")

module.exports = (client, instance) => {
	client.on("interactionCreate", async (interaction) => {
		try {
			if (!interaction.isSelectMenu()) return

			if (interaction.customId === "page") {
				guild = interaction.member.guild
				await help.callback({ instance, guild, interaction })
			}
		} catch (error) {
			console.error(`Select: ${error}`)
		}
	})
}
