const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['lb'],
    category: 'Economia',
    description: 'Resgata sua lootbox grátis (disponível a cada 12 horas)',
    slash: 'both',
    cooldown: '12h',
    guildOnly: true,
    callback: async ({user}) => {
        try {
            functions.createUser(user.id)
            const quantity = await functions.readFile(user.id, 'Lootbox')
            functions.changeJSON(user.id, 'Falcoins', quantity)
            return `Parabéns! Você ganhou **${quantity}** falcoins :heart_eyes:`
        } catch (error) {
            console.error(`lootbox: ${error}`)
        }
    }
}
