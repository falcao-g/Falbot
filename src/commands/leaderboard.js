const { MessageEmbed, MessageButton } = require("discord.js")
const { getMember, format, paginate } = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const { Falbot } = require("../../index.js")

module.exports = {
	description: "show the global or local ranking of usersasd",
	slash: true,
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "falcoins",
			description: "View users ranked by falcoins",
			type: "SUB_COMMAND",
			options: [
				{
					name: "type",
					description: "server or global",
					type: "STRING",
					choices: [
						{ name: "server", value: "server" },
						{ name: "global", value: "global" },
					],
					required: true,
				},
			],
		},
		{
			name: "rank",
			description: "View users ranked by ranks",
			type: "SUB_COMMAND",
			options: [
				{
					name: "type",
					description: "server or global",
					type: "STRING",
					choices: [
						{ name: "server", value: "server" },
						{ name: "global", value: "global" },
					],
					required: true,
				},
			],
		},
		{
			name: "wins",
			description: "View users ranked by wins",
			type: "SUB_COMMAND",
			options: [
				{
					name: "type",
					description: "server or global",
					type: "STRING",
					choices: [
						{ name: "server", value: "server" },
						{ name: "global", value: "global" },
					],
					required: true,
				},
			],
		},
	],
	callback: async ({ client, user, guild, interaction }) => {
		rank = []
		scope = interaction.options.getString("type").toLowerCase()
		type = interaction.options.getSubcommand()
		await interaction.deferReply()

		var embed1 = new MessageEmbed()
			.setColor("DarkBlue")
			.setFooter({ text: "by Falcão ❤️" })
		var embed2 = new MessageEmbed()
			.setColor("DarkBlue")
			.setFooter({ text: "by Falcão ❤️" })
		var embed3 = new MessageEmbed()
			.setColor("DarkBlue")
			.setFooter({ text: "by Falcão ❤️" })

		embeds = [embed1, embed2, embed3]

		if (type == "falcoins") {
			if (scope === "server") {
				users = await Falbot.userSchema
					.find({})
					.sort({ falcoins: -1 })
					.limit(30)

				for (useri of users) {
					if (await getMember(guild, useri["_id"])) {
						rank.push(useri)
					}
				}
			} else {
				rank = await Falbot.userSchema.find({}).sort({ falcoins: -1 }).limit(30)
			}
		} else if (type == "rank") {
			if (scope === "server") {
				users = await Falbot.userSchema.find({}).sort({ rank: -1 }).limit(30)

				for (useri of users) {
					if (await getMember(guild, useri["_id"])) {
						rank.push(useri)
					}
				}
			} else {
				rank = await Falbot.userSchema.find({}).sort({ rank: -1 }).limit(30)
			}
		} else if (type == "wins") {
			if (scope === "server") {
				users = await Falbot.userSchema
					.find({})
					.sort({ vitorias: -1 })
					.limit(30)

				for (useri of users) {
					if (await getMember(guild, useri["_id"])) {
						rank.push(useri)
					}
				}
			} else {
				rank = await Falbot.userSchema.find({}).sort({ vitorias: -1 }).limit(30)
			}
		}

		for (let i = 0; i < rank.length; i++) {
			if (i <= 9) {
				a = 0
			} else if (i <= 19) {
				a = 1
			} else {
				a = 2
			}
			try {
				if (scope === "server") {
					member = await getMember(guild, rank[i]["_id"])
					username = member.displayName
				} else {
					user = await client.users.fetch(rank[i]["_id"])
					username = user.username
				}

				embeds[a].addFields({
					name:
						type == "wins"
							? `${i + 1}º - ${username} ` +
							  Falbot.getMessage(guild, "VITORIAS").toLowerCase() +
							  ":"
							: `${i + 1}º - ${username} ${type}:`,
					value:
						type == "rank"
							? `${Falbot.getMessage(guild, rank[i][type])}`
							: `${
									type == "wins" ? rank[i]["vitorias"] : format(rank[i][type])
							  }`,
				})
			} catch {
				embeds[a].addFields({
					name:
						type === "vitorias"
							? `${i + 1}º - Unknown user ` +
							  Falbot.getMessage(guild, "VITORIAS").toLowerCase() +
							  ":"
							: `${i + 1}º - Unknown user ${type}:`,
					value:
						type === "rank"
							? `${Falbot.getMessage(guild, rank[i][type])}`
							: `${
									type == "wins" ? rank[i]["vitorias"] : format(rank[i][type])
							  }`,
				})
			}
		}

		if (embed3.fields.length != 0) {
			embeds = [embed1, embed2, embed3]
		} else if (embed2.fields.length != 0) {
			embeds = [embed1, embed2]
		} else {
			embeds = [embed1]
		}

		if (embeds.length > 1) {
			for (let i = 0; i < embeds.length; i++) {
				if (scope == "server") {
					embeds[i].setTitle(
						`${Falbot.getMessage(guild, "LEADERBOARD_SERVER_TITLE")} - ${
							i + 1
						}/3`
					)
				} else {
					embeds[i].setTitle(
						`${Falbot.getMessage(guild, "LEADERBOARD_GLOBAL_TITLE")} - ${
							i + 1
						}/3`
					)
				}
			}

			const paginator = paginate()
			paginator.add(...embeds)
			const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
			paginator.setTraverser([
				new MessageButton()
					.setEmoji("⬅️")
					.setCustomId(ids[0])
					.setStyle("SECONDARY"),
				new MessageButton()
					.setEmoji("➡️")
					.setCustomId(ids[1])
					.setStyle("SECONDARY"),
				,
			])
			const message = await interaction.editReply(paginator.components())
			message.channel
				.createMessageComponentCollector()
				.on("collect", async (i) => {
					if (i.customId === ids[0]) {
						await paginator.back()
						await i.update(paginator.components())
					} else if (i.customId === ids[1]) {
						await paginator.next()
						await i.update(paginator.components())
					}
				})
		} else {
			if (scope == "server") {
				embed1.setTitle(Falbot.getMessage(guild, "LEADERBOARD_SERVER_TITLE"))
			} else {
				embed1.setTitle(Falbot.getMessage(guild, "LEADERBOARD_GLOBAL_TITLE"))
			}

			await interaction.editReply({ embeds: [embeds[0]] })
		}
	},
}
