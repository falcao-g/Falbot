const { MessageEmbed } = require("discord.js")
const { testOnly } = require("../config.json")
const { msToTime } = require("../utils/functions.js")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Check some bot stats",
	slash: true,
	guildOnly: true,
	testOnly,
	callback: async ({ guild, client, interaction }) => {
		try {
			await interaction.deferReply()
			const embed = new MessageEmbed()
				.setColor("NAVY")
				.addFields({
					name: "Falbot info",
					value: `**:earth_americas: Site: https://falbot.netlify.app/\n:robot: Github: https://github.com/falcao-g/Falbot\n:bird: Twitter: https://twitter.com/falb0t\n:house: ${Falbot.getMessage(
						guild,
						"SERVERS"
					)}: ${
						client.guilds.cache.size
					}\n:busts_in_silhouette: ${Falbot.getMessage(guild, "PLAYERS")}: ${
						(await Falbot.userSchema.find({})).length
					}\n:zap: ${Falbot.getMessage(guild, "UPTIME")}: ${msToTime(
						client.uptime
					)}**`,
				})
				.setFooter({ text: "by Falcão ❤️" })
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`botinfo: ${error}`)
		}
	},
}
