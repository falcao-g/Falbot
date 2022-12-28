const { MessageEmbed } = require("discord.js")
const { testOnly } = require("../config.json")
const { msToTime } = require("../utils/functions.js")
const userSchema = require("../schemas/user-schema")

module.exports = {
	category: "uteis",
	description: "Check some bot stats",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	callback: async ({ instance, guild, client, interaction }) => {
		try {
			await interaction.deferReply()
			const embed = new MessageEmbed()
				.setColor("NAVY")
				.setFooter({ text: "by Falcão ❤️" })
				.addFields({
					name: "Falbot info",
					value: `**:earth_americas: Site: https://falbot.netlify.app/\n:robot: Github: https://github.com/falcao-g/Falbot\n:bird: Twitter: https://twitter.com/falb0t\n:house: ${instance.messageHandler.get(
						guild,
						"SERVERS"
					)}: ${
						client.guilds.cache.size
					}\n:busts_in_silhouette: ${instance.messageHandler.get(
						guild,
						"PLAYERS"
					)}: ${
						(await userSchema.find({})).length
					}\n:zap: ${instance.messageHandler.get(
						guild,
						"UPTIME"
					)}: ${await msToTime(client.uptime)}**`,
				})
			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`botinfo: ${error}`)
		}
	},
}
