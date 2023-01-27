const { MessageEmbed } = require("discord.js")
const math = require("mathjs")
const { getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

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
	callback: async ({ interaction, guild, user, text }) => {
		try {
			await interaction.deferReply()
			text = text.replaceAll("**", "^")
			answer = await math.evaluate(text).toString()

			const embed = new MessageEmbed()
				.setColor(await getRoleColor(guild, user.id))
				.addFields({
					name: Falbot.getMessage(guild, "RESULTADO"),
					value: answer,
				})
				.setFooter({ text: "by Falcão ❤️" })

			await interaction.editReply({ embeds: [embed] })
		} catch (error) {
			console.error(`math: ${error}`)
		}
	},
}
