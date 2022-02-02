const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['ajuda', 'help'],
    category: 'help',
    description: 'Mostra uma lista de todos os comandos e algumas outras informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    callback: async ({args}) => {
        try {
            return await functions.explain(args[0] || '')
        } catch (error) {
            console.error(`Comandos: ${error}`)
        }
    }
}
