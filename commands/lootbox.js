const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    aliases: ['lb'],
    category: 'Economia',
    description: 'Resgata sua lootbox grátis (disponível a cada 12 horas)',
    slash: 'both',
    cooldown: '12h',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            const quantity = await functions.readFile(user.id, 'Lootbox')
            functions.changeJSON(user.id, 'Falcoins', quantity)
            return instance.messageHandler.get(guild, "LOOTBOX", {FALCOINS: quantity})
        } catch (error) {
            console.error(`lootbox: ${error}`)
        }
    }
}