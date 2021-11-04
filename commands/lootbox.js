const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['lb'],
    category: 'Economia',
    description: 'Resgata sua lootbox grátis (disponível a cada 12 horas)',
    slash: 'both',
    cooldown: '12h',
    guildOnly: true,
    callback: async ({message, interaction}) => {
        try {
            const quantity = await functions.readFile(message ? message.author.id : interaction.user.id, 'Lootbox')
            functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', quantity)
            return `Parabéns! Você ganhou **${quantity}** falcoins :heart_eyes:`
        } catch (error) {
            if (error.message.includes("Cannot read property 'Lootbox' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('lootbox:', error)
            }
        }
    }
}