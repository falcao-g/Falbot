const { MessageEmbed } = require("discord.js")
const { getRoleColor, getMember } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Fun",
	description: "Send someone to horny jail",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "user",
			description: "the poor soul that will be sent to horny jail",
			required: true,
			type: "USER",
		},
	],
	callback: async ({ instance, guild, interaction, user, member, args }) => {
		try {
			await interaction.deferReply()
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setImage(
					"https://i.kym-cdn.com/photos/images/original/002/051/072/a4c.gif"
				)
				.setFooter({ text: "by Falcão ❤️" })
			const member2 = await getMember(guild, args[0])
			await interaction.editReply({
				content:
					`${member2.displayName}` +
					instance.messageHandler.get(guild, "BONKED") +
					`${member.displayName}`,
				embeds: [embed],
			})
		} catch (error) {
			console.error(`Bonk: ${error}`)
		}
	},
}
