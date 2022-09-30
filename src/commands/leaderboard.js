const { MessageEmbed, MessageButton } = require("discord.js")
const {
	getMember,
	getRoleColor,
	format,
	paginate,
	leaderboardEmbeds,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")
const userSchema = require("../schemas/user-schema.js")

module.exports = {
	category: "Economia",
	description: "show the global or local ranking of users",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "money",
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
	callback: async ({ client, user, guild, interaction, instance }) => {
		try {
			rank = []
			scope = interaction.options.getString("type").toLowerCase()
			type = interaction.options.getSubcommand()
			await interaction.deferReply()

			if (type == "money") {
				if (scope === "server") {
					users = await userSchema.find({}).sort({ falcoins: -1 }).limit(30)

					for (useri of users) {
						if (await getMember(guild, useri["_id"])) {
							rank.push(useri)
						}
					}
				} else {
					rank = await userSchema.find({}).sort({ falcoins: -1 }).limit(30)
				}

				var embed1 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed2 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed3 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				embeds = [embed1, embed2, embed3]

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
						embeds[a].addField(
							`${i + 1}º - ${username} falcoins:`,
							`${await format(rank[i]["falcoins"])}`,
							false
						)
					} catch {
						embeds[a].addField(
							`${i + 1}º - Unknown user falcoins:`,
							`${await format(rank[i]["falcoins"])}`,
							false
						)
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
					const paginator = await paginate()
					paginator.add(...embeds)
					const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
					await paginator.setTraverser([
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
					paginator.setMessage(message)
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
					await interaction.editReply({ embeds: [embeds[0]] })
				}
			} else if (type == "rank") {
				if (scope === "server") {
					users = await userSchema.find({}).sort({ rank: -1 }).limit(30)

					for (useri of users) {
						if (await getMember(guild, useri["_id"])) {
							rank.push(useri)
						}
					}
				} else {
					rank = await userSchema.find({}).sort({ rank: -1 }).limit(30)
				}

				var embed1 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed2 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed3 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				embeds = [embed1, embed2, embed3]

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
						embeds[a].addField(
							`${i + 1}º - ${username} rank:`,
							`${instance.messageHandler.get(guild, rank[i]["rank"])}`,
							false
						)
					} catch {
						embeds[a].addField(
							`${i + 1}º - Unknown user rank:`,
							`${instance.messageHandler.get(guild, rank[i]["rank"])}`,
							false
						)
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
					const paginator = await paginate()
					paginator.add(...embeds)
					const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
					await paginator.setTraverser([
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
					paginator.setMessage(message)
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
					await interaction.editReply({ embeds: [embeds[0]] })
				}
			} else if (type == "wins") {
				if (scope === "server") {
					users = await userSchema.find({}).sort({ vitorias: -1 }).limit(30)

					for (useri of users) {
						if (await getMember(guild, useri["_id"])) {
							rank.push(useri)
						}
					}
				} else {
					rank = await userSchema.find({}).sort({ vitorias: -1 }).limit(30)
				}

				var embed1 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed2 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })
				var embed3 = new MessageEmbed()
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				embeds = [embed1, embed2, embed3]

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
						embeds[a].addField(
							`${i + 1}º - ${username} ` +
								instance.messageHandler.get(guild, "VITORIAS").toLowerCase() +
								":",
							`${await format(rank[i]["vitorias"])}`,
							false
						)
					} catch {
						embeds[a].addField(
							`${i + 1}º - Unknown user ` +
								instance.messageHandler.get(guild, "VITORIAS").toLowerCase() +
								":",
							`${await format(rank[i]["vitorias"])}`,
							false
						)
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
					const paginator = await paginate()
					paginator.add(...embeds)
					const ids = [`${Date.now()}__left`, `${Date.now()}__right`]
					await paginator.setTraverser([
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
					paginator.setMessage(message)
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
					await interaction.editReply({ embeds: [embeds[0]] })
				}
			}
		} catch (error) {
			console.error(`leaderboard: ${error}`)
		}
	},
}
