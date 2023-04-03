const {
	EmbedBuilder,
	ContextMenuCommandBuilder,
	ApplicationCommandType,
} = require("discord.js")
const {
	getRoleColor,
	format,
	readFile,
	buttons,
} = require("../utils/functions.js")

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's balance")
		.setNameLocalization("pt-BR", "Ver a conta do usuário")
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ guild, instance, interaction }) => {
		await interaction.deferReply()
		try {
			const target = interaction.targetMember
			const { rank, falcoins, vitorias, banco } = await readFile(target.user.id)

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

			await interaction.editReply({
				embeds: [embed],
				components: [buttons(["cooldowns", "help"])],
			})
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
