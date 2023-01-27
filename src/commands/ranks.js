const { MessageEmbed } = require("discord.js")
const { readFile, changeDB, format } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "Increase your rank",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "rankup",
			description: "Increase your rank",
			type: "SUB_COMMAND",
		},
		{
			name: "view",
			description: "View upcoming ranks",
			type: "SUB_COMMAND",
		},
		{
			name: "all",
			description: "View all ranks",
			type: "SUB_COMMAND",
		},
	],
	callback: async ({ guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			type = interaction.options.getSubcommand()
			var levels = Falbot.levels

			if (type === "rankup") {
				var rank_number = await readFile(user.id, "rank")
				rank = levels[rank_number - 1]

				if (rank.falcoinsToLevelUp === undefined) {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "MAX_RANK", {
							USER: user,
						}),
					})
				} else if (
					(await readFile(user.id, "falcoins")) < rank.falcoinsToLevelUp
				) {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "NO_MONEY_RANK", {
							FALCOINS: await format(
								rank.falcoinsToLevelUp - (await readFile(user.id, "falcoins"))
							),
						}),
					})
				} else {
					new_rank = levels[rank_number]

					await changeDB(user.id, "falcoins", -rank.falcoinsToLevelUp)
					await changeDB(user.id, "rank", rank_number + 1, true)

					perks = await Falbot.rankPerks(rank, new_rank, guild)

					var embed = new MessageEmbed()
						.setColor("AQUA")
						.addFields(
							{
								name: "Rank Up!",
								value: Falbot.getMessage(guild, "RANKUP_SUCESS", {
									RANK: Falbot.getMessage(guild, String(rank_number + 1)),
									FALCOINS: await format(rank.falcoinsToLevelUp),
								}),
							},
							{
								name: Falbot.getMessage(guild, "RANKUP_PERKS"),
								value: perks,
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					await interaction.editReply({
						embeds: [embed],
					})
				}
			} else if (type === "view") {
				var rank_number = await readFile(user.id, "rank")
				if (rank_number === 16) {
					await interaction.editReply({
						content: Falbot.getMessage(guild, "MAX_RANK", {
							USER: user,
						}),
					})
					return
				}

				quantity = 16 - rank_number
				if (quantity > 3) {
					quantity = 3
				}

				var embed = new MessageEmbed()
					.setColor("DARK_PURPLE")
					.setTitle(Falbot.getMessage(guild, "UPCOMING_RANKS"))
					.addFields({
						name:
							Falbot.getMessage(guild, String(rank_number)) +
							" - " +
							(await format(levels[rank_number - 1].falcoinsToLevelUp)) +
							" Falcoins" +
							Falbot.getMessage(guild, "CURRENT_RANK"),
						value: await Falbot.rankPerks(
							levels[rank_number - 2],
							levels[rank_number - 1],
							guild
						),
					})

				for (var i = 0; i < quantity; i++) {
					if (levels[rank_number + i].falcoinsToLevelUp === undefined) {
						embed.addFields({
							name:
								Falbot.getMessage(guild, String(rank_number + i + 1)) +
								" - " +
								Falbot.getMessage(guild, "MAX_RANK2"),
							value: await Falbot.rankPerks(
								levels[rank_number - 1 + i],
								levels[rank_number + i],
								guild
							),
						})
					} else {
						embed.addFields({
							name:
								Falbot.getMessage(guild, String(rank_number + i + 1)) +
								" - " +
								(await format(levels[rank_number + i].falcoinsToLevelUp)) +
								" Falcoins",
							value: await Falbot.rankPerks(
								levels[rank_number - 1 + i],
								levels[rank_number + i],
								guild
							),
						})
					}
				}

				embed.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({ embeds: [embed] })
			} else {
				var embed = new MessageEmbed().setColor("DARK_PURPLE")

				ranks = ""
				for (var i = 0; i < levels.length; i++) {
					if (levels[i].falcoinsToLevelUp === undefined) {
						ranks +=
							`**${Falbot.getMessage(guild, String(i + 1))}** - ` +
							Falbot.getMessage(guild, "MAX_RANK2") +
							"\n"
					} else {
						ranks += `**${Falbot.getMessage(
							guild,
							String(i + 1)
						)}** - ${await format(levels[i].falcoinsToLevelUp)} falcoins\n`
					}
				}
				embed
					.addFields({
						name: Falbot.getMessage(guild, "ALL_RANKS"),
						value: ranks,
					})
					.setFooter({ text: "by Falcão ❤️" })
				await interaction.editReply({ embeds: [embed] })
			}
		} catch (err) {
			console.error(`ranks: ${err}`)
		}
	},
}
