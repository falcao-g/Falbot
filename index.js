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
    testServers: '742332099788275732',
    disabledDefaultCommands: [
      'command',
      'language',
      'requiredrole',
      'channelonly',
      'slash'
  ],
  mongoUri: config.MONGODB_URI
  })
  .setDefaultPrefix(config.PREFIX)

  client.user.setActivity('?comandos | arte by: @kinsallum')

  setInterval(functions.bankInterest, 1000 * 86400)
})

// client.on('guildCreate', (guild) => {
//   const roles = guild.roles.fetch()
//   roles.forEach((role) => {
//     console.log(role)
//   })
// })

client.login(config.TOKEN)