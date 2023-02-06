const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const { getRoleColor, format, readFile } = require("../utils/functions.js")
const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
} = require("discord.js")

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's balance")
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ guild, interaction }) => {
		await interaction.deferReply()
		try {
			const target = interaction.targetMember
			const userFile = await readFile(target.user.id)

			const embed = new EmbedBuilder()
				.setTitle(
					Falbot.getMessage(guild, userFile.rank) + " " + target.displayName
				)
				.setColor(await getRoleColor(guild, target.user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields(
					{
						name: ":coin: Falcoins",
						value: `${format(userFile.falcoins)}`,
						inline: true,
					},
					{
						name: ":trophy: " + Falbot.getMessage(guild, "VITORIAS"),
						value: `${format(userFile.vitorias)}`,
						inline: true,
					},
					{
						name: ":bank: " + Falbot.getMessage(guild, "BANCO"),
						value: `${format(userFile.banco)}`,
						inline: true,
					},
					{
						name: ":gift: " + Falbot.getMessage(guild, "CAIXAS"),
						value: `${format(userFile.caixas)}`,
						inline: true,
					},
					{
						name: ":key: " + Falbot.getMessage(guild, "CHAVES"),
						value: `${format(userFile.chaves)}`,
						inline: true,
					}
				)
			if (Falbot.levels[userFile.rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(
					":sparkles: " + Falbot.getMessage(guild, "MAX_RANK2")
				)
			} else if (
				Falbot.levels[userFile.rank - 1].falcoinsToLevelUp <= userFile.falcoins
			) {
				embed.setDescription(Falbot.getMessage(guild, "BALANCE_RANKUP"))
			} else {
				embed.setDescription(
					Falbot.getMessage(guild, "BALANCE_RANKUP2", {
						FALCOINS: format(
							Falbot.levels[userFile.rank - 1].falcoinsToLevelUp -
								userFile.falcoins
						),
					})
				)
			}

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("cooldowns")
					.setEmoji("⏱️")
					.setStyle("Secondary"),
				new ButtonBuilder()
					.setCustomId("help")
					.setEmoji("📚")
					.setStyle("Secondary"),
			])

			await interaction.editReply({ embeds: [embed], components: [row] })
		} catch (error) {
			console.error(`balance: ${error}`)
			interaction.editReply({
				content: Falbot.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
