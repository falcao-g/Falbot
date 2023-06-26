const { randint, changeDB, format } = require("./utils/functions.js")
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const path = require("path")
require("dotenv").config()
const mongoose = require("mongoose")
const { loadEvents } = require("./handlers/eventHandler.js")
const { loadCommands } = require("./handlers/commandHandler.js")

class Falbot {
	config = require("./config.json")
	_messages = require(path.join(__dirname, "/utils/json/messages.json"))
	_banned = new Array()
	_disabledChannels = new Map()
	emojiList = {}
	client = new Client({
		intents: [GatewayIntentBits.Guilds],
	})
	levels = require("./utils/json/levels.json")
	items = require("./utils/json/items.json")
	userSchema = require("./schemas/user-schema")
	lottoSchema = require("./schemas/lotto-schema")
	interestSchema = require("./schemas/interest-schema.js")
	bannedSchema = require("./schemas/banned-schema.js")
	guildsSchema = require("./schemas/guilds-schema.js")

	constructor() {
		this.client.on("ready", () => {
			console.log("Bot online")
			this.client.on("error", console.error)

			try {
				mongoose.set("strictQuery", false)
				mongoose.connect(process.env.MONGODB_URI, {
					keepAlive: true,
				})
			} catch {
				console.log("A conexão caiu")
				mongoose.connect(process.env.MONGODB_URI)
			}

			mongoose.connection.on("error", (err) => {
				console.log(`Erro na conexão: ${err}`)
				mongoose.connect(process.env.MONGODB_URI)
			})

			mongoose.connection.on("disconnected", () => {
				console.log("A conexão caiu")
				mongoose.connect(process.env.MONGODB_URI)
			})

			mongoose.connection.on("disconnecting", () => {
				console.log("A conexão caiu")
				mongoose.connect(process.env.MONGODB_URI)
			})

			mongoose.connection.on("MongoNetworkError", () => {
				console.log("A conexão caiu")
				mongoose.connect(process.env.MONGODB_URI)
			})

			mongoose.connection.on("MongooseServerSelectionError", () => {
				console.log("A conexão caiu")
				mongoose.connect(process.env.MONGODB_URI)
			})

			this.client.events = new Collection()
			this.client.commands = new Collection()

			loadEvents(this, this.client)
			loadCommands(this, this.client)
		})

		this.client.login(process.env.TOKEN)
		;(async () => {
			const banned = await this.bannedSchema.find()

			for (const result of banned) {
				this._banned.push(result.id)
			}

			const guilds = await this.guildsSchema.find()

			for (const { _id, disabledChannels } of guilds) {
				this._disabledChannels.set(_id, disabledChannels)
			}

			this.config.testGuilds.forEach(async (guild) => {
				guild = this.client.guilds.cache.get(guild)
				for (const [key, value] of await guild.emojis.fetch()) {
					this.emojiList[value.name] = value
				}
			})
		})()

		setInterval(() => {
			this.client.user.setActivity("/help | arte by: @kinsallum"),
				this.bankInterest(),
				this.sendVoteReminders(),
				this.lotteryDraw()
		}, 1000 * 60 * 5)
	}

	async bankInterest() {
		let interest = await this.interestSchema.findById("interest")
		if (Date.now() - interest.lastInterest > 1000 * 60 * 60 * 24) {
			console.log("poupança!")
			interest.lastInterest = Date.now().toString()

			var users = await this.userSchema.find({
				banco: { $gt: 0 },
			})

			for (let user of users) {
				var limit = this.levels[user.rank - 1].bankLimit

				if (limit > user.banco) {
					user.banco += Math.floor(parseInt(user.banco * 0.1))
				}

				if (user.banco > limit) {
					user.banco = limit
				}

				user.save()
			}
			interest.save()
		}
	}

	async sendVoteReminders() {
		try {
			var users = await this.userSchema.find({
				voteReminder: true,
			})

			for (let user of users) {
				if (Date.now() - user.lastVote > 1000 * 60 * 60 * 12 && Date.now() - user.lastReminder > 1000 * 60 * 60 * 12) {
					var discordUser = await this.client.users.fetch(user._id)
					const embed = new EmbedBuilder()
						.setColor(16776960)
						.addFields(
							{
								name: await this.getDmMessage(discordUser, "VOTE_REMINDER"),
								value: await this.getDmMessage(discordUser, "REWARD_AFTER"),
							},
							{
								name: "Link",
								value: "https://top.gg/bot/742331813539872798/vote",
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					const row = new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("disableVoteReminder")
							.setLabel(await this.getDmMessage(discordUser, "DISABLE_REMINDER"))
							.setEmoji("🔕")
							.setStyle("Danger")
					)

					await discordUser.send({
						embeds: [embed],
						components: [row],
					})

					user.lastReminder = Date.now()
					user.save()
				}
			}
		} catch (err) {
			console.log(`Sending reminders: ${err}`)
		}
	}

	async lotteryDraw() {
		let lotto = await this.lottoSchema.findById("semanal")

		if (Date.now() > lotto.nextDraw) {
			console.log("loteria!")

			const users = await this.userSchema.find({
				tickets: { $gt: 0 },
			})

			if (users.length > 0) {
				const numTickets = users.reduce((acc, user) => acc + user.tickets, 0)

				var winner
				while (winner === undefined) {
					for (let user of users) {
						if (randint(1, numTickets) <= user.tickets) {
							winner = user
						}
					}
				}

				await changeDB(winner.id, "falcoins", lotto.prize)

				var winnerUser = await this.client.users.fetch(winner.id)

				const embed = new EmbedBuilder()
					.setColor(15844367)
					.addFields({
						name: await this.getDmMessage(winnerUser, "CONGRATULATIONS"),
						value: await this.getDmMessage(winnerUser, "LOTTERY_WIN", {
							PRIZE: format(lotto.prize),
							TICKETS: format(winner.tickets),
							TOTAL: format(numTickets),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })

				await this.userSchema.updateMany(
					{
						tickets: { $gt: 0 },
					},
					{
						tickets: 0,
					}
				)

				await winnerUser.send({
					embeds: [embed],
				})

				lotto.history.unshift({
					prize: lotto.prize,
					winner: winnerUser.username,
					userTickets: winner.tickets,
					totalTickets: numTickets,
				})
				lotto.prize = randint(3500000, 5000000)
			} else {
				lotto.history.unshift({
					prize: lotto.prize,
				})
				lotto.prize = lotto.prize + randint(3500000, 5000000)
			}

			if (lotto.history.length >= 10) lotto.history.pop()
			lotto.nextDraw = Date.now() + 604800000 //next one is next week
			await lotto.save()
		}
	}

	ban(userId) {
		this._banned.push(userId)
		//ensure banned users don't get vote reminders, because it would be a spam
		changeDB(userId, "voteReminder", false, true)
	}

	unban(userId) {
		this._banned = this._banned.filter((id) => id != userId)
	}

	defaultFilter(interaction) {
		var disabledChannels = this._disabledChannels.get(interaction.guild.id)

		return !interaction.user.bot && !this._banned.includes(interaction.user.id) && disabledChannels != undefined
			? !disabledChannels.includes(interaction.channel.id)
			: true
	}

	disableChannel(guild, channel) {
		const result = this._disabledChannels.get(guild.id)
		if (result) {
			result.push(channel.id)
			this._disabledChannels.set(guild.id, result)
		} else {
			this._disabledChannels.set(guild.id, [channel.id])
		}
	}

	enableChannel(guild, channel) {
		var result = this._disabledChannels.get(guild.id)
		result = result.filter((channelId) => channelId != channel.id)
		this._disabledChannels.set(guild.id, result)
	}

	getMessage(interaction, messageId, args = {}) {
		const message = this._messages[messageId]
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`)
			return "Could not find the correct message to send. Please report this to the bot developer."
		}

		var locale = interaction.locale ?? "pt-BR"
		var result = message[locale] ?? message["en-US"]

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, "g")
			result = result.replace(expression, args[key])
		}

		this.userSchema.findByIdAndUpdate(interaction.user.id, { locale: locale }).then(() => {})
		return result
	}

	async getDmMessage(user, messageId, args = {}) {
		const message = this._messages[messageId]
		if (!message) {
			console.error(`Could not find the correct message to send for "${messageId}"`)
			return "Could not find the correct message to send. Please report this to the bot developer."
		}

		var userFile = await this.userSchema.findById(user.id)
		var locale = userFile.locale ?? "en-US"
		var result = message[locale] ?? message["en-US"]

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, "g")
			result = result.replace(expression, args[key])
		}

		return result
	}

	async rankPerks(old_rank, rank, interaction) {
		var perks = ""
		if (old_rank != undefined) {
			if (old_rank.bankLimit < rank.bankLimit) {
				perks += this.getMessage(interaction, "RANKUP_BANK", {
					FALCOINS: format(rank.bankLimit - old_rank.bankLimit),
				})
				perks += "\n"
			}

			if (old_rank.inventoryLimit < rank.inventoryLimit) {
				perks += this.getMessage(interaction, "RANKUP_INVENTORY", {
					FALCOINS: format(rank.inventoryLimit - old_rank.inventoryLimit),
				})
				perks += "\n"
			}
		}

		perks += `${this.getMessage(interaction, "VOTO")}: ${format(rank.vote)} Falcoins\n`

		perks += `${this.getMessage(interaction, "TRABALHO")}: ${format(rank.work[0])}-${format(rank.work[1])} Falcoins`

		return perks
	}

	getInventoryWorth(inventory) {
		return Array.from(inventory).reduce((acc, [itemName, quantity]) => {
			acc += this.items[itemName]["value"] * quantity
			return acc
		}, 0)
	}
}

Falbot = new Falbot()
