const Discord = require('discord.js')
const config = require("./config/config.json")
const intents = new Discord.Intents(32767)
const client = new Discord.Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const functions = require('./functions.js')

client.on("ready", () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    ignoreBots: true,
    ephemeral: false,
    botOwners: [config.owner],
    testServers: '742332099788275732',
    defaultLanguage: 'portuguese',
    disabledDefaultCommands: [
      'command',
      'language',
      'requiredrole',
      'channelonly'
  ],
  mongoUri: config.MONGODB_URI
  })
  .setDefaultPrefix(config.PREFIX)

  client.user.setActivity('?comandos | arte by: @kinsallum')

  setInterval(functions.bankInterest, 1000 * 86400)

  setInterval(() => {
    client.user.setActivity('?comandos | arte by: @kinsallum')
  }, 1000 * 600)
})
client.login(config.TOKEN)
