const {MessageEmbed} = require('discord.js')
const {testOnly} = require("../config.json")
const {msToTime} = require('../utils/functions.js')

module.exports =  {
    category: 'uteis',
    description: 'Check some bot stats',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    callback: async ({instance, guild, client}) => {
        try {
            const embed = new MessageEmbed()
            .setColor("NAVY")
            .setFooter(({text: 'by Falcão ❤️'}))
            .addField('Falbot info', `**:earth_americas: Site: https://falbot.netlify.app/\n:robot: Github: https://github.com/falcao-g/Falbot\n:bird: Twitter: https://twitter.com/falb0t\n:house: ${instance.messageHandler.get(guild, 'SERVERS')}: ${client.guilds.cache.size}\n:busts_in_silhouette: ${instance.messageHandler.get(guild, 'PLAYERS')}: ${client.users.cache.size}\n:zap: ${instance.messageHandler.get(guild, 'UPTIME')}: ${await msToTime(client.uptime)}**`)
            return embed
        } catch (error) {
                console.error(`botinfo: ${error}`)
        }
    }
}