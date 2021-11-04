const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports = {
    category: 'Economia',
    description: 'Cria seu registro no banco de dados do bot',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({message, interaction, args}) => {
        try {
            const create = await functions.createUser(message ? message.author.id : interaction.user.id)
            if (create) {
                return `Seu registro foi criado! :slight_smile:\nuse /eu para ver suas informações e /comandos para ver todos os comandos disponiveis`
            } else {
                return `Ocorreu um erro! :face_with_spiral_eyes: \nuse /eu para verificar se ja possui um registro, caso não possua tente novamente mais tarde`
            }
        } catch (error) {
            console.log('cria:', error)
        }
    }
}