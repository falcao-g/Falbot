const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Mostra suas informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({message, interaction}) => {
        try {
            const user = await functions.readFile(message ? message.author.id : interaction.user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
            .setAuthor(message ? message.author.username : interaction.user.username, message ? message.author.avatarURL() : interaction.user.avatarURL())
            .setFooter('by Falcão ❤️')
            .addFields({
                name: ':coin: Falcoins',
                value: `${user['Falcoins']}`,
                inline: true
            },{
                name: ':trophy: Vitorias',
                value: `${user['Vitorias']}`,
                inline: true
            }, {
                name: ':bank: Banco',
                value: `${user['Banco']}`,
                inline: true
            }, {
                name: ':gift: Caixas',
                value: `${user['Caixas']}`,
                inline: true
            }, {
                name: ':key: Chaves',
                value: `${user['Chaves']}`,
                inline: true
            })
    
            return embed
            
        } catch (error) {
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('eu:', error)
            }
        }
    }
}