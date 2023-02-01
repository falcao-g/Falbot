const builder = require("./src/index")
const path = require("path")
const { owners, someServers, language } = require("./src/config.json")
const WOKCommands = require("wokcommands")
const mongoose = require("mongoose")
const { Intents, Client } = require("discord.js")
require("dotenv").config()
const client = new Client({
	intents: new Intents(["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]),
})

client.on("ready", () => {
	client.on("error", console.error)

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

	Falbot = new builder.Falbot(wok, client)

	module.exports = { Falbot }
})

client.login(process.env.TOKEN)
