const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder } = require("discord.js")
const { format, paginate } = require("../utils/functions.js")

async function getMember(guild, member_id) {
	try {
		return await guild.members.fetch(member_id)
	} catch {
		return undefined
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setNameLocalization("pt-BR", "classificação")
		.setDescription("Show the global or local ranking of users")
		.setDescriptionLocalization("pt-BR", "Mostra a classicação global ou local de usuários")
		.setDMPermission(false)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("falcoins")
				.setDescription("View users ranked by falcoins")
				.setDescriptionLocalization("pt-BR", "Veja a classificação de usuários por falcoins")
				.addStringOption((option) =>
					option
						.setName("type")
						.setNameLocalization("pt-BR", "tipo")
						.setDescription("leaderboard of the server or global")
						.setDescriptionLocalization("pt-BR", "classificação do servidor ou global")
						.setRequired(true)
						.addChoices(
							{
								name: "server",
								name_localizations: { "pt-BR": "servidor" },
								value: "server",
							},
							{ name: "global", value: "global" }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("rank")
				.setDescription("View users ranked by ranks")
				.setDescriptionLocalization("pt-BR", "Veja a classificação de usuários por rank")
				.addStringOption((option) =>
					option
						.setName("type")
						.setNameLocalization("pt-BR", "tipo")
						.setDescription("leaderboard of the server or global")
						.setDescriptionLocalization("pt-BR", "classificação do servidor ou global")
						.setRequired(true)
						.addChoices(
							{
								name: "server",
								name_localizations: { "pt-BR": "servidor" },
								value: "server",
							},
							{ name: "global", value: "global" }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("wins")
				.setNameLocalization("pt-BR", "vitórias")
				.setDescription("View users ranked by wins")
				.setDescriptionLocalization("pt-BR", "Veja a classificação de usuários por vitórias")
				.addStringOption((option) =>
					option
						.setName("type")
						.setNameLocalization("pt-BR", "tipo")
						.setDescription("leaderboard of the server or global")
						.setDescriptionLocalization("pt-BR", "classificação do servidor ou global")
						.setRequired(true)
						.addChoices(
							{
								name: "server",
								name_localizations: { "pt-BR": "servidor" },
								value: "server",
							},
							{ name: "global", value: "global" }
						)
				)
		),
	execute: async ({ client, user, guild, interaction, instance }) => {
		try {
			await interaction.deferReply()
			var rank = []
			const scope = interaction.options.getString("type")

			var embed1 = new EmbedBuilder().setColor("#206694").setFooter({ text: "by Falcão ❤️" })
			var embed2 = new EmbedBuilder().setColor("#206694").setFooter({ text: "by Falcão ❤️" })
			var embed3 = new EmbedBuilder().setColor("#206694").setFooter({ text: "by Falcão ❤️" })

			embeds = [embed1, embed2, embed3]

			enums = {
				falcoins: "falcoins",
				rank: "rank",
				wins: "vitorias",
			}

			const type = enums[interaction.options.getSubcommand()]

			if (scope === "server") {
				users = await instance.userSchema.find({}).sort({ [type]: -1 })

				for (useri of users) {
					if (await getMember(guild, useri["_id"])) {
						rank.push(useri)
					}
				}
			} else {
				rank = await instance.userSchema
					.find({})
					.sort({ [type]: -1 })
					.limit(30)
			}

			for (let i = 0; i < rank.length; i++) {
				a = Math.min(Math.floor(i / 10), 2)

				if (scope === "server") {
					try {
						member = await getMember(guild, rank[i]["_id"])
						username = member.displayName
					} catch {
						username = "Unknown user"
					}
				} else {
					try {
						user = await client.users.fetch(rank[i]["_id"])
						username = user.username
					} catch {
						username = "Unknown user"
					}
				}

				embeds[a].addFields({
					name: `${i + 1}º - ${username} ${type}:`,
					value: type == "rank" ? `${instance.getMessage(interaction, rank[i][type])}` : `${format(rank[i][type])}`,
				})
			}

			if (embed3.data.fields) {
				embeds = [embed1, embed2, embed3]
			} else if (embed2.data.fields) {
				embeds = [embed1, embed2]
			} else {
				embeds = [embed1]
			}

			if (embeds.length > 1) {
				for (let i = 0; i < embeds.length; i++) {
					embeds[i].setTitle(
						`${instance.getMessage(interaction, `LEADERBOARD_${scope.toUpperCase()}_TITLE`)} - ${i + 1}/3`
					)
				}

				const paginator = paginate()
				paginator.add(...embeds)
				const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
				paginator.setTraverser([
					new ButtonBuilder().setEmoji("⬅️").setCustomId(ids[0]).setStyle("Secondary"),
					new ButtonBuilder().setEmoji("➡️").setCustomId(ids[1]).setStyle("Secondary"),
				])
				const message = await interaction.editReply(paginator.components())
				message.channel.createMessageComponentCollector().on("collect", async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back()
						await i.update(paginator.components())
					} else if (i.customId === ids[1]) {
						await paginator.next()
						await i.update(paginator.components())
					}
				})
			} else {
				embed1.setTitle(instance.getMessage(interaction, `LEADERBOARD_${scope.toUpperCase()}_TITLE`))
				await interaction.editReply({ embeds: [embeds[0]] })
			}
		} catch (error) {
			console.error(`leaderboard: ${error}`)
			interaction.editReply({
				content: instance.getMessage(interaction, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
