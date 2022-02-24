const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'Mostra suas informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            const userfile = await functions.readFile(user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .setAuthor({name: user.username, iconURL: user.avatarURL()})
            .setFooter({text: 'by Falcão ❤️'})
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(userfile['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: ' + instance.messageHandler.get(guild, 'VITORIAS'),
                value: `${await functions.format(userfile['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: ' + instance.messageHandler.get(guild, 'BANCO'),
                value: `${await functions.format(userfile['Banco'])}`,
                inline: true
            }, {
                name: ':gift: ' + instance.messageHandler.get(guild, 'CAIXAS'),
                value: `${await functions.format(userfile['Caixas'])}`,
                inline: true
            }, {
                name: ':key: ' + instance.messageHandler.get(guild, 'CHAVES'),
                value: `${await functions.format(userfile['Chaves'])}`,
                inline: true
            })
    
            return embed
            
        } catch (error) {
            console.error(`eu: ${error}`)
        }
    }
}