const fs = require("fs")
const userSchema = require("./schemas/user-schema")
const { randint, changeDB, format } = require("./utils/functions.js")
const lottoSchema = require("./schemas/lotto-schema")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const levels = require("./utils/json/levels.json")
const path = require("path")
const { owners, someServers, language } = require("./config.json")
const WOKCommands = require("wokcommands")
const mongoose = require("mongoose")
const { Intents, Client } = require("discord.js")
require("dotenv").config()
const client = new Client({
	intents: new Intents(["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]),
})

client.on("ready", () => {
	client.on("error", console.error)
})

client.login(process.env.TOKEN)

class Falbot {
	_languages = []
	defaultLanguage = "portugues"
	client = client
	_messages = require(path.join(__dirname, "/utils/json/messages.json"))

	constructor() {
		try {
			mongoose.set("strictQuery", false)
			mongoose.connect(process.env.MONGODB_URI)
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

		const wok = new WOKCommands(client, {
			commandsDir: path.join(__dirname, "/commands"),
			featuresDir: path.join(__dirname, "/events"),
			ignoreBots: true,
			ephemeral: false,
			botOwners: owners,
			testServers: someServers,
			defaultLanguage: language,
			messagesPath: path.join(__dirname, "/utils/json/messages.json"),
			disabledDefaultCommands: [
				"language",
				"help",
				"command",
				"requiredrole",
				"channelonly",
				"prefix",
			],
			showWarns: false,
		})

		wok._mongoConnection = mongoose.connection
		this.wok = wok
		this.languageSchema = wok._mongoConnection.models["wokcommands-languages"]
		this.cooldownsSchema = wok._mongoConnection.models["wokcommands-cooldowns"]

		for (const messageId of Object.keys(this._messages)) {
			for (const language of Object.keys(this._messages[messageId])) {
				this._languages.push(language.toLowerCase())
			}
		}

		if (!this._languages.includes(this.defaultLanguage)) {
			throw new Error(`The current default language defined is not supported.`)
		}

		setInterval(async () => {
			await this.cooldownsSchema.updateMany({}, { $inc: { cooldown: -5 } })
			await this.cooldownsSchema.deleteMany({ cooldown: { $lt: 5 } })
		}, 5000)

		setInterval(() => {
			client.user.setActivity("/help | arte by: @kinsallum"),
				this.bankInterest(),
				this.sendVoteReminders(),
				this.lotteryDraw()
		}, 1000 * 60 * 10)
	}

	async bankInterest() {
		var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"))
		if (
			Date.now() - config["poupanca"]["last_interest"] >
			config["poupanca"]["interest_time"]
		) {
			console.log("poupança!")
			config["poupanca"]["last_interest"] = Date.now().toString()

			var users = await userSchema.find({
				banco: { $gt: 0 },
			})

			let user
			for (user of users) {
				var limit = levels[user.rank - 1].bankLimit

				if (limit > user.banco) {
					user.banco += Math.floor(
						parseInt(
							user.banco * parseFloat(config["poupanca"]["interest_rate"])
						)
					)
				}

				if (user.banco > limit) {
					user.banco = limit
				}

				user.save()
			}

			let json2 = JSON.stringify(config, null, 1)

			fs.writeFileSync("./src/config.json", json2, "utf8", (err) => {
				if (err) throw err
			})
		}
	}

	async sendVoteReminders() {
		try {
			var users = await userSchema.find({
				voteReminder: true,
			})

			let user
			for (user of users) {
				//send dm reminder vote if user wants to
				if (
					Date.now() - user.lastVote > 1000 * 60 * 60 * 12 &&
					Date.now() - user.lastReminder > 1000 * 60 * 60 * 12
				) {
					var discordUser = await client.users.fetch(user._id)
					const embed = new MessageEmbed()
						.setColor("YELLOW")
						.addFields(
							{
								name: await this.getMessage(discordUser, "VOTE_REMINDER"),
								value: await this.getMessage(discordUser, "REWARD_AFTER"),
							},
							{
								name: "Link",
								value: "https://top.gg/bot/742331813539872798/vote",
							}
						)
						.setFooter({ text: "by Falcão ❤️" })

					const row = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId("disableVoteReminder")
							.setLabel(await this.getMessage(discordUser, "DISABLE_REMINDER"))
							.setEmoji("🔕")
							.setStyle("DANGER")
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
		let lotto = await lottoSchema.findById("semanal")

		if (Date.now() > lotto.nextDraw) {
			console.log("loteria!")

			var users = await userSchema.find({
				tickets: { $gt: 0 },
			})

			if (users.length > 0) {
				var numTickets = 0
				let user
				for (user of users) {
					numTickets += user.tickets
				}

				var winner
				while (winner === undefined) {
					for (user of users) {
						if (randint(1, numTickets) <= user.tickets) {
							winner = user
						}
					}
				}

				await changeDB(winner.id, "falcoins", lotto.prize)

				var winnerUser = await client.users.fetch(winner.id)

				const embed = new MessageEmbed()
					.setColor("GOLD")
					.addFields({
						name: await this.getMessage(winnerUser, "CONGRATULATIONS"),
						value: await this.getMessage(winnerUser, "LOTTERY_WIN", {
							PRIZE: await format(lotto.prize),
							TICKETS: await format(winner.tickets),
							TOTAL: await format(numTickets),
						}),
					})
					.setFooter({ text: "by Falcão ❤️" })

				await userSchema.updateMany(
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

				if (lotto.history.length >= 10) {
					lotto.history.pop()
				}

				lotto.history.unshift({
					prize: lotto.prize,
					winner: winnerUser.username,
					userTickets: winner.tickets,
					totalTickets: numTickets,
				})
			}
			lotto.nextDraw = Date.now() + 604800000 //next one is next week
			lotto.prize = randint(1000000, 2000000)

			await lotto.save()
		}
	}

	async getLanguage(id) {
		if (id) {
			const result = await this.languageSchema.findById(id)
			if (result) {
				return result.language
			}
		}
		return this.defaultLanguage
	}

	async getMessage(id, messageId, args = {}) {
		const language = await this.getLanguage(id)
		const translations = this._messages[messageId]
		if (!translations) {
			console.error(
				`WOKCommands > Could not find the correct message to send for "${messageId}"`
			)
			return "Could not find the correct message to send. Please report this to the bot developer."
		}

		let result = translations[language]

		for (const key of Object.keys(args)) {
			const expression = new RegExp(`{${key}}`, "g")
			result = result.replace(expression, args[key])
		}

		return result
	}
}

module.exports = { Falbot }
