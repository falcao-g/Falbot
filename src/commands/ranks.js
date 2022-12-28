const { MessageEmbed } = require("discord.js")
const {
	readFile,
	changeDB,
	rankPerks,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const levels = require("../utils/json/levels.json")

module.exports = {
	category: "Economia",
	description: "Increase your rank",
	slash: true,
	cooldown: "1s",
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
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			await interaction.deferReply()
			type = interaction.options.getSubcommand()

			switch (type) {
				case "rankup":
					var rank_number = await readFile(user.id, "rank")
					rank = levels[rank_number - 1]

					if (rank.falcoinsToLevelUp === undefined) {
						await interaction.editReply({
							content: instance.messageHandler.get(guild, "MAX_RANK", {
								USER: user,
							}),
						})
					} else if (
						(await readFile(user.id, "falcoins")) < rank.falcoinsToLevelUp
					) {
						await interaction.editReply({
							content: instance.messageHandler.get(guild, "NO_MONEY_RANK", {
								FALCOINS: await format(
									rank.falcoinsToLevelUp - (await readFile(user.id, "falcoins"))
								),
							}),
						})
					} else {
						new_rank = levels[rank_number]

						await changeDB(user.id, "falcoins", -rank.falcoinsToLevelUp)
						await changeDB(user.id, "rank", rank_number + 1, true)

						perks = await rankPerks(rank, new_rank, instance, guild)

						var embed = new MessageEmbed()
							.setColor("AQUA")
							.addFields(
								{
									name: "Rank Up!",
									value: instance.messageHandler.get(guild, "RANKUP_SUCESS", {
										RANK: instance.messageHandler.get(
											guild,
											String(rank_number + 1)
										),
										FALCOINS: await format(rank.falcoinsToLevelUp),
									}),
								},
								{
									name: instance.messageHandler.get(guild, "RANKUP_PERKS"),
									value: perks,
								}
							)
							.setFooter({ text: "by Falcão ❤️" })

						await interaction.editReply({
							embeds: [embed],
						})
						return
					}
				case "view":
					var rank_number = await readFile(user.id, "rank")
					if (rank_number === 16) {
						await interaction.editReply({
							content: instance.messageHandler.get(guild, "MAX_RANK", {
								USER: user,
							}),
						})
					}

					quantity = 16 - rank_number
					if (quantity > 3) {
						quantity = 3
					}

					var embed = new MessageEmbed()
						.setColor("DARK_PURPLE")
						.setTitle(instance.messageHandler.get(guild, "UPCOMING_RANKS"))
						.addFields({
							name:
								instance.messageHandler.get(guild, String(rank_number)) +
								" - " +
								(await format(levels[rank_number - 1].falcoinsToLevelUp)) +
								" Falcoins" +
								instance.messageHandler.get(guild, "CURRENT_RANK"),
							value: await rankPerks(
								levels[rank_number - 2],
								levels[rank_number - 1],
								instance,
								guild
							),
						})

					for (var i = 0; i < quantity; i++) {
						if (levels[rank_number + i].falcoinsToLevelUp === undefined) {
							embed.addFields({
								name:
									instance.messageHandler.get(
										guild,
										String(rank_number + i + 1)
									) +
									" - " +
									instance.messageHandler.get(guild, "MAX_RANK2"),
								value: await rankPerks(
									levels[rank_number - 1 + i],
									levels[rank_number + i],
									instance,
									guild
								),
							})
						} else {
							embed.addFields({
								name:
									instance.messageHandler.get(
										guild,
										String(rank_number + i + 1)
									) +
									" - " +
									(await format(levels[rank_number + i].falcoinsToLevelUp)) +
									" Falcoins",
								value: await rankPerks(
									levels[rank_number - 1 + i],
									levels[rank_number + i],
									instance,
									guild
								),
							})
						}
					}

					embed.setFooter({ text: "by Falcão ❤️" })
					await interaction.editReply({ embeds: [embed] })
					return
				case "all":
					var embed = new MessageEmbed().setColor("DARK_PURPLE")

					ranks = ""
					for (var i = 0; i < levels.length; i++) {
						if (levels[i].falcoinsToLevelUp === undefined) {
							ranks +=
								`**${instance.messageHandler.get(guild, String(i + 1))}** - ` +
								instance.messageHandler.get(guild, "MAX_RANK2") +
								"\n"
						} else {
							ranks += `**${instance.messageHandler.get(
								guild,
								String(i + 1)
							)}** - ${await format(levels[i].falcoinsToLevelUp)} falcoins\n`
						}
					}
					embed
						.addFields({
							name: instance.messageHandler.get(guild, "ALL_RANKS"),
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
