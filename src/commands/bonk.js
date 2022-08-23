const { MessageEmbed } = require("discord.js")
const { getRoleColor, getMember } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Fun",
	description: "Send someone to horny jail",
	slash: "both",
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	minArgs: 1,
	expectedArgs: "<usuario>",
	expectedArgsTypes: ["USER"],
	options: [
		{
			name: "user",
			description: "the poor soul that will be sent to horny jail",
			required: true,
			type: "USER",
		},
	],
	callback: async ({
		instance,
		guild,
		message,
		interaction,
		user,
		member,
		args,
	}) => {
		try {
			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.setImage(
					"https://i.kym-cdn.com/photos/images/original/002/051/072/a4c.gif"
				)
				.setFooter({ text: "by Falcão ❤️" })
			if (message) {
				return embed
			} else {
				const member2 = await getMember(guild, args[0])
				await interaction.reply({
					content:
						`${member2.displayName}` +
						instance.messageHandler.get(guild, "BONKED") +
						`${member.displayName}`,
					embeds: [embed],
				})
			}
		} catch (error) {
			console.error(`Bonk: ${error}`)
		}
	},
}
