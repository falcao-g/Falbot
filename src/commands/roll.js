const { EmbedBuilder } = require("discord.js")
const Roll = require("roll")
const { getRoleColor } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	testOnly,
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Roll dice for you")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("dice")
				.setDescription("dice to be rolled")
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, instance }) => {
		try {
			await interaction.deferReply()
			const roll = new Roll()
			text = interaction.options.getString("dice").replace(/\s/g, "")

			if (!roll.validate(text)) {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: text,
					}),
				})
			} else {
				rolled = roll.roll(text).result.toString()

				embed = new EmbedBuilder()
					.setColor(await getRoleColor(guild, user.id))
					.addFields(
						{
							name: "🎲:",
							value: text,
							inline: false,
						},
						{
							name: instance.getMessage(guild, "RESULTADO"),
							value: `**${rolled}**`,
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({
					embeds: [embed],
				})
			}
		} catch (error) {
			console.error(`roll: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
			})
		}
	},
}
