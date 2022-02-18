const Discord = require('discord.js')
const config = require("./config/config.json")
const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'])
const client = new Discord.Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const functions = require('./functions.js')

client.on("ready", () => {
  const wok = new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    ignoreBots: true,
    ephemeral: false,
    botOwners: config.owners,
    testServers: config.someServers,
    defaultLanguage: config.language,
    messagesPath: '../messages.json',
    disabledDefaultCommands: [
      'command',
      'requiredrole',
      'channelonly'
  ],
  mongoUri: config.MONGODB_URI
  })
  .setDefaultPrefix(config.PREFIX)

  wok.on('commandException', (command, error) => {
    console.log(`An exception occured when using command "${command.names[0]}"! The error is:`)
    console.log(error)
  })

  setInterval(() => {
    client.user.setActivity('?comandos | arte by: @kinsallum'),
    functions.bankInterest()
    console.log(`O bot está em ${client.guilds.cache.size} servidores`)
    console.log(`Tem ${client.users.cache.size} usuários usando o bot`)
  }, 1000 * 600)
})
client.login(config.TOKEN)
