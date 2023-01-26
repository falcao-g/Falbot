const { MessageEmbed } = require("discord.js")
const math = require("mathjs")
const { getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	description: "Resolve a mathematical expression",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "expression",
			description: "the mathematical expression to be solved",
			required: true,
			type: "STRING",
		},
	],
	callback: async ({ instance, interaction, guild, user, text }) => {
		try {
			await interaction.deferReply()
			text = text.replaceAll("**", "^")
			answer = await math.evaluate(text).toString()

			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.addFields({
					name: instance.messageHandler.get(guild, "RESULTADO"),
					value: answer,
				})
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`math: ${error}`)
		}
	},
}
