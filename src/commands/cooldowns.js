const Discord = require('discord.js')
const functions = require('../utils/functions.js')
const config = require("../config.json")
const cooldownSchema = require('wokcommands/dist/models/cooldown.js')

module.exports =  {
    aliases: ['espera'],
    category: 'uteis',
    description: 'Shows your commands cooldowns',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            userCooldown = await cooldownSchema.findById(`lootbox-${guild.id}-${user.id}`)
            voteCooldown = Date.now() - await functions.readFile(user.id, 'lastVote')
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .setAuthor({name: user.username, iconURL: user.avatarURL()})
            .setFooter({text: 'by Falcão ❤️'})
            .addFields({
                name: instance.messageHandler.get(guild, 'COOLDOWNS'),
                value: `Lootbox: **${userCooldown ? `:red_circle: ${await functions.msToTime(userCooldown['cooldown'] * 1000)}` : `:green_circle: ${instance.messageHandler.get(guild, 'PRONTO')}`}**
                ${instance.messageHandler.get(guild, 'VOTO')}: **${voteCooldown < 43200000 ? `:red_circle: ${await functions.msToTime(43200000 - voteCooldown)}` : `:green_circle: ${instance.messageHandler.get(guild, 'PRONTO')}`}**`
            })
            
            return embed
        } catch (error) {
                console.error(`cooldowns: ${error}`)
        }
    }
}