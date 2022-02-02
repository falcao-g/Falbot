const Discord = require('discord.js')
const config = require("./config/config.json")
const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'])
const client = new Discord.Client({ intents })
const WOKCommands = require('wokcommands')
const path = require('path')
const functions = require('./functions.js')

client.on("ready", () => {
  console.log(`O bot está em ${client.guilds.cache.size} servidores`)
  console.log(`Tem ${client.users.cache.size} usuários usando o bot`)

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
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

  setInterval(functions.bankInterest, 1000 * 300)

  setInterval(() => {
    client.user.setActivity('?comandos | arte by: @kinsallum')
  }, 1000 * 300)
})
client.login(config.TOKEN)
