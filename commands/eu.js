const Discord = require('discord.js')
const functions = require('../functions.js')
const falbotjson = require("../falbot.json")

module.exports =  {
    category: 'Economia',
    description: 'Mostra suas informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({message, interaction, user}) => {
        try {
            functions.createUser(user.id)
            const userfile = await functions.readFile(user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
            .setAuthor(user.username, user.avatarURL())
            .setFooter('by Falcão ❤️')
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(userfile['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: Vitorias',
                value: `${await functions.format(userfile['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: Banco',
                value: `${await functions.format(userfile['Banco'])}`,
                inline: true
            }, {
                name: ':gift: Caixas',
                value: `${await functions.format(userfile['Caixas'])}`,
                inline: true
            }, {
                name: ':key: Chaves',
                value: `${await functions.format(userfile['Chaves'])}`,
                inline: true
            })
    
            return embed
            
        } catch (error) {
            console.error(`eu: ${error}`)
        }
    }
}
