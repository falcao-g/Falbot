const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['ajuda', 'help'],
    description: 'Mostra uma lista de todos os comandos e algumas outras informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({message, interaction, args}) => {
        try {
            return await functions.explain(args[0] || '')
        } catch (error) {
            console.log('comandos:', error)
        }
    }
}