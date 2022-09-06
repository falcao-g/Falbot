const { MessageEmbed } = require("discord.js")
const { getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Fun",
	description: "Create a little pretty poll",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "theme",
			description: "theme of the poll",
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ instance, guild, interaction, user, member, text }) => {
		try {
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setDescription(text)
				.setAuthor({
					name: instance.messageHandler.get(guild, "ENQUETE", {
						USER: member.displayName,
					}),
					iconURL: user.avatarURL(),
				})
				.setFooter({ text: "by Falcão ❤️" })

			answer = await interaction.reply({
				embeds: [embed],
				fetchReply: true,
			})

			answer.react("👍")
			answer.react("👎")
		} catch (error) {
			console.error(`poll: ${error}`)
		}
	},
}
