const { Intents, Client } = require("discord.js")
require("dotenv").config()
const { owners, someServers, language } = require("./src/config.json")
const intents = new Intents([
	"GUILDS",
	"GUILD_MESSAGES",
	"GUILD_MESSAGE_REACTIONS",
])
const client = new Client({ intents })
const WOKCommands = require("wokcommands")
const path = require("path")
const {
	bankInterest,
	sendVoteReminders,
	lotteryDraw,
} = require("./src/utils/functions.js")
const mongoose = require("mongoose")

client.on("ready", () => {
	try {
		mongoose.set("strictQuery", false)
		mongoose.connect(process.env.MONGODB_URI)
	} catch {
		console.log("A conexão caiu")
		setTimeout(() => mongoose.connect(process.env.MONGODB_URI), 1000)
	}

	mongoose.connection.on("error", (err) => {
		console.log(`Erro na conexão: ${err}`)
		setTimeout(() => mongoose.connect(process.env.MONGODB_URI), 1000)
	})

	mongoose.connection.on("disconnected", () => {
		console.log("A conexão caiu")
		setTimeout(() => mongoose.connect(process.env.MONGODB_URI), 1000)
	})

	mongoose.connection.on("MongoNetworkError", () => {
		console.log("A conexão caiu")
		setTimeout(() => mongoose.connect(process.env.MONGODB_URI), 1000)
	})

	const wok = new WOKCommands(client, {
		commandsDir: path.join(__dirname, "/src/commands"),
		featuresDir: path.join(__dirname, "/src/events"),
		ignoreBots: true,
		ephemeral: false,
		botOwners: owners,
		testServers: someServers,
		defaultLanguage: language,
		messagesPath: path.join(__dirname, "/src/utils/json/messages.json"),
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

	client.on("error", console.error)

	setInterval(() => {
		client.user.setActivity("/help | arte by: @kinsallum"),
			bankInterest(),
			sendVoteReminders(wok, client),
			lotteryDraw(wok, client)
	}, 1000 * 60 * 10)
})

client.login(process.env.TOKEN)
