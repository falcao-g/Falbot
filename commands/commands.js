const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['ajuda', 'commandos', 'help'],
    category: 'uteis',
    description: 'Show all commands or info about a specific command',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    options: [
        {
            name: 'command',
            description: 'the command you want to get info about, leave blank to see all commands',
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