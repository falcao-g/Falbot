const {
	EmbedBuilder,
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	time,
} = require("discord.js")
const {
	getRoleColor,
	format,
	readFile,
	buttons,
} = require("../utils/functions.js")

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("See user's profile")
		.setNameLocalization("pt-BR", "Ver o perfil do usuário")
		.setType(ApplicationCommandType.User)
		.setDMPermission(false),
	execute: async ({ guild, instance, interaction }) => {
		await interaction.deferReply()
		try {
			const user = interaction.options.getUser("user")
			const target = user ? await guild.members.fetch(user.id) : member
			const {
				rank,
				falcoins,
				vitorias,
				banco,
				inventory,
				voteStreak,
				tickets,
				createdAt,
			} = await readFile(target.user.id)
			const limit = instance.levels[rank - 1].bankLimit
			const items = instance.items

			if (instance.levels[rank - 1].falcoinsToLevelUp === undefined) {
				var rankText = ":sparkles: " + instance.getMessage(guild, "MAX_RANK2")
			} else if (instance.levels[rank - 1].falcoinsToLevelUp <= falcoins) {
				var rankText = instance.getMessage(guild, "BALANCE_RANKUP")
			} else {
				var rankText = instance.getMessage(guild, "BALANCE_RANKUP2", {
					FALCOINS: format(
						instance.levels[rank - 1].falcoinsToLevelUp - falcoins
					),
				})
			}

			var inventoryQuantity = 0
			const inventoryWorth = Array.from(inventory).reduce(
				(acc, [itemName, quantity]) => {
					acc += items[itemName]["value"] * quantity
					inventoryQuantity += quantity
					return acc
				},
				0
			)

			const embed = new EmbedBuilder()
				.setTitle(
					instance.getMessage(guild, "PROFILE", { USER: target.displayName })
				)
				.setColor(await getRoleColor(guild, target.user.id))
				.setFooter({ text: "by Falcão ❤️" })
				.setThumbnail(target.user.avatarURL())
				.addFields(
					{
						name: "Rank",
						value: `${instance.getMessage(guild, rank)}\n${rankText}`,
					},
					{
						name: "Info",
						value: instance.getMessage(guild, "PROFILE_INFOS", {
							FALCOINS: format(falcoins),
							WINS: format(vitorias),
							BANK: format(banco),
							LIMIT: format(limit),
							TICKETS: format(tickets),
							QUANTITY: format(inventoryQuantity),
							WORTH: format(inventoryWorth),
							STREAK: Math.floor(voteStreak / 2),
							CREATED: time(createdAt, "d"),
						}),
					}
				)

			await interaction.editReply({
				embeds: [embed],
				components: [buttons(["cooldowns", "help"])],
			})
		} catch (error) {
			console.error(`contextProfile: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
