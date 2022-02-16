const Discord = require('discord.js')
const config = require("./config/config.json")
const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'])
const client = new Discord.Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const functions = require('./functions.js')

client.on("ready", () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    ignoreBots: true,
    ephemeral: false,
    botOwners: config.owners,
    testServers: config.someServers,
    defaultLanguage: config.language,
    disabledDefaultCommands: [
      'command',
      'language',
      'requiredrole',
      'channelonly'
  ],
  mongoUri: config.MONGODB_URI
  })
  .setDefaultPrefix(config.PREFIX)

  setInterval(() => {
    client.user.setActivity('?comandos | arte by: @kinsallum'),
    functions.bankInterest()
    console.log(`O bot está em ${client.guilds.cache.size} servidores`)
    console.log(`Tem ${client.users.cache.size} usuários usando o bot`)
  }, 1000 * 600)
})
client.login(config.TOKEN)
