const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Mostra suas informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: false,
    callback: async ({message, interaction}) => {
        try {
            functions.createUser(message ? message.author.id : interaction.user.id)
            const user = await functions.readFile(message ? message.author.id : interaction.user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
            .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
            .setFooter('by Falcão ❤️')
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(user['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: Vitorias',
                value: `${await functions.format(user['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: Banco',
                value: `${await functions.format(user['Banco'])}`,
                inline: true
            }, {
                name: ':gift: Caixas',
                value: `${await functions.format(user['Caixas'])}`,
                inline: true
            }, {
                name: ':key: Chaves',
                value: `${await functions.format(user['Chaves'])}`,
                inline: true
            })
    
            return embed
            
        } catch (error) {
            console.log('eu:', error)
        }
    }
}
