const {Intents, Client} = require('discord.js')
const config = require("./src/config.json")
const intents = new Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'])
const client = new Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const {bankInterest} = require('./src/utils/functions.js')
const mongoose = require('mongoose')

client.on("ready", () => {
  const wok = new WOKCommands(client, {
    commandsDir: path.join(__dirname, '/src/commands'),
    featuresDir: path.join(__dirname, '/src/events'),
    ignoreBots: true,
    ephemeral: false,
    botOwners: config.owners,
    testServers: config.someServers,
    defaultLanguage: config.language,
    messagesPath: path.join(__dirname, '/src/utils/json/messages.json'),
    disabledDefaultCommands: [
      'command',
      'requiredrole',
      'channelonly'
  ],
  mongoUri: config.MONGODB_URI
  })
  .setDefaultPrefix(config.PREFIX)

  wok.on('commandException', (command, error) => {
    console.log(`Um erro ocorreu no comando "${command.names[0]}"! O erro foi:`)
    console.log(error)
  })

  mongoose.connection.on('error', (err) => {
    console.log(`Erro na conexão do mongoDB: ${err}`)
    console.log(wok.mongoConnection())
  })

  setInterval(() => {
    client.user.setActivity('?comandos | arte by: @kinsallum'),
    bankInterest()
  }, 1000 * 600)
})
client.login(config.TOKEN)
