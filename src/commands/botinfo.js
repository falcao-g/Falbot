const { msToTime } = require("../utils/functions.js")
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("botinfo")
		.setDescription("Check some bot stats")
		.setDescriptionLocalization("pt-BR", "Veja informações úteis sobre o bot")
		.setDMPermission(false),
	execute: async ({ client, interaction, instance }) => {
		await interaction.deferReply()
		try {
			const embed = new EmbedBuilder()
				.setColor(3426654)
				.addFields({
					name: "Falbot info",
					value: `**:earth_americas: Site: https://falbot.netlify.app/\n:robot: Github: https://github.com/falcao-g/Falbot\n:bird: Twitter: https://twitter.com/falb0t\n:house: ${instance.getMessage(
						interaction,
						"SERVERS"
					)}: ${client.guilds.cache.size}\n:busts_in_silhouette: ${instance.getMessage(interaction, "PLAYERS")}: ${
						(await instance.userSchema.find({})).length
					}\n:zap: ${instance.getMessage(interaction, "UPTIME")}: ${msToTime(client.uptime)}**`,
				})
				.setFooter({ text: "by Falcão ❤️" })
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`botinfo: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
