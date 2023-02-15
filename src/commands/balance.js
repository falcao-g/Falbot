const {
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	SlashCommandBuilder,
} = require("discord.js")
const {
	getMember,
	getRoleColor,
	format,
	readFile,
} = require("../utils/functions.js")

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
	execute: async ({ guild, member, instance, interaction }) => {
		await interaction.deferReply()
		try {
			const user = interaction.options.getUser("user")
			const target = user ? await getMember(guild, user.id) : member
			const { rank, falcoins, vitorias, banco, caixas, chaves } =
				await readFile(target.user.id)

			const embed = new EmbedBuilder()
				.setTitle(instance.getMessage(guild, rank) + " " + target.displayName)
				.setColor(await getRoleColor(guild, target.user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields(
					{
						name: ":coin: Falcoins",
						value: `${format(falcoins)}`,
						inline: true,
					},
					{
						name: ":trophy: " + instance.getMessage(guild, "VITORIAS"),
						value: `${format(vitorias)}`,
						inline: true,
					},
					{
						name: ":bank: " + instance.getMessage(guild, "BANCO"),
						value: `${format(banco)}`,
						inline: true,
					},
					{
						name: ":gift: " + instance.getMessage(guild, "CAIXAS"),
						value: `${format(caixas)}`,
						inline: true,
					},
					{
						name: ":key: " + instance.getMessage(guild, "CHAVES"),
						value: `${format(chaves)}`,
						inline: true,
					}
				)
			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(
					":sparkles: " + instance.getMessage(guild, "MAX_RANK2")
				)
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				embed.setDescription(instance.getMessage(guild, "BALANCE_RANKUP"))
			} else {
				embed.setDescription(
					instance.getMessage(guild, "BALANCE_RANKUP2", {
						FALCOINS: format(
							instance.levels[rank - 1].falcoinsToLevelUp - falcoins
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
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
