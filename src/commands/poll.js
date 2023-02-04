const { EmbedBuilder } = require("discord.js")
const { getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("poll")
		.setDescription("Create a little pretty poll")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("theme")
				.setDescription("theme of the poll")
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, member, instance }) => {
		try {
			await interaction.deferReply()
			const embed = new EmbedBuilder()
				.setColor(await getRoleColor(guild, user.id))
				.setDescription(interaction.options.getString("theme"))
				.setAuthor({
					name: instance.getMessage(guild, "ENQUETE", {
						USER: member.displayName,
					}),
					iconURL: user.avatarURL(),
				})
				.setFooter({ text: "by Falcão ❤️" })

			answer = await interaction.editReply({
				embeds: [embed],
				fetchReply: true,
			})

			answer.react("👍")
			answer.react("👎")
		} catch (error) {
			console.error(`poll: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
