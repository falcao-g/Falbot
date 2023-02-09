const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js")
const {
	getMember,
	getRoleColor,
	format,
	readFile,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setNameLocalization("pt-BR", "conta")
		.setDescription("Shows your or another user's balance")
		.setDescriptionLocalization(
			"pt-BR",
			"Mostra a sua conta ou a de outro usuário"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuário")
				.setDescription(
					"the user you want to get info about, leave blank to get your balance"
				)
				.setDescriptionLocalization(
					"pt-BR",
					"o usuário que você deseja ver a conta, deixe vazio para ver a sua"
				)
				.setRequired(false)
		),
	execute: async ({ guild, member, interaction }) => {
		await interaction.deferReply()
		try {
			user = interaction.options.getUser("user")
			const realMember = user ? await getMember(guild, user.id) : member
			const userFile = await readFile(realMember.user.id)

			const embed = new EmbedBuilder()
				.setTitle(
					Falbot.getMessage(guild, userFile.rank) + " " + realMember.displayName
				)
				.setColor(await getRoleColor(guild, realMember.user.id))
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
