const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { getRoleColor, format, readFile, buttons } = require("../utils/functions.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("balance")
		.setNameLocalization("pt-BR", "conta")
		.setDescription("Shows your or another user's balance")
		.setDescriptionLocalization("pt-BR", "Mostra a sua conta ou a de outro usuário")
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setNameLocalization("pt-BR", "usuário")
				.setDescription("the user you want to get info about, leave blank to get your balance")
				.setDescriptionLocalization("pt-BR", "o usuário que você deseja ver a conta, deixe vazio para ver a sua")
				.setRequired(false)
		),
	execute: async ({ guild, member, instance, interaction }) => {
		await interaction.deferReply()
		try {
			if (interaction.options != undefined) {
				var user = interaction.options.getUser("user")
			}
			const target = user ? await guild.members.fetch(user.id) : member
			const { rank, falcoins, vitorias, banco } = await readFile(target.user.id)

			const embed = new EmbedBuilder()
				.setTitle(instance.getMessage(interaction, rank) + " " + target.displayName)
				.setColor(await getRoleColor(guild, target.user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.addFields(
					{
						name: ":coin: Falcoins",
						value: `${format(falcoins)}`,
						inline: true,
					},
					{
						name: ":trophy: " + instance.getMessage(interaction, "VITORIAS"),
						value: `${format(vitorias)}`,
						inline: true,
					},
					{
						name: ":bank: " + instance.getMessage(interaction, "BANCO"),
						value: `${format(banco)}`,
						inline: true,
					}
				)
			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				embed.setDescription(":sparkles: " + instance.getMessage(interaction, "MAX_RANK2"))
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				embed.setDescription(instance.getMessage(interaction, "BALANCE_RANKUP"))
			} else {
				embed.setDescription(
					instance.getMessage(interaction, "BALANCE_RANKUP2", {
						FALCOINS: format(instance.levels[rank - 1].falcoinsToLevelUp - falcoins),
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
				content: instance.getMessage(interaction, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
