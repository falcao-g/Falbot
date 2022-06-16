const {Intents, Client} = require('discord.js')
require('dotenv').config()
const {MONGODB_URI, TOKEN} = process.env
const {owners, someServers, language, PREFIX} = require('./src/config.json')
const intents = new Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'])
const client = new Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const {bankInterest, placeReset} = require('./src/utils/functions.js')
const mongoose = require('mongoose')

client.on("ready", () => {
  const wok = new WOKCommands(client, {
    commandsDir: path.join(__dirname, '/src/commands'),
    featuresDir: path.join(__dirname, '/src/events'),
    ignoreBots: true,
    ephemeral: false,
    botOwners: owners,
    testServers: someServers,
    defaultLanguage: language,
    messagesPath: path.join(__dirname, '/src/utils/json/messages.json'),
    disabledDefaultCommands: [
      'help',
      'command',
      'requiredrole',
      'channelonly'
  ],
  mongoUri: MONGODB_URI
  })
  .setDefaultPrefix(PREFIX)

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
    bankInterest(),
    placeReset()
  }, 1000 * 60 * 30)
})
client.login(TOKEN)
