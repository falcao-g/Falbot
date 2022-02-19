const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['ajuda', 'help'],
    category: 'help',
    description: 'Mostra uma lista de todos os comandos e algumas outras informações',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    options: [
        {
            name: 'comando',
            description: 'caso deseje informação sobre um comando específico, digite o nome dele, deixe em branco para ver sobre todos',
            required: false,
            type: Discord.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    testOnly: config.testOnly,
    callback: async ({args, instance, guild}) => {
        try {
            return await functions.explain(instance, guild, args[0] || '')
        } catch (error) {
            console.error(`Comandos: ${error}`)
        }
    }
}