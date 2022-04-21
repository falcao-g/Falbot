const Discord = require('discord.js')
const functions = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['caixa'],
    category: 'Economia',
    description: 'Spend 1 key and 1 crate for a chance to get some prizes',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    testOnly: config.testOnly,
    expectedArgs: '<quantity>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantity',
        description: 'quantity of crates you wish to open',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({instance, guild, user, args}) => {
        try {
            try {
                var quantity = await functions.specialArg(args[0], user.id, "caixas")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
        if (await functions.readFile(user.id, 'caixas') >= quantity && await functions.readFile(user.id, 'chaves') >= quantity) {
            caixas = 0
            chaves = 0
            falcoins = 0
            for (let i = 0; i < quantity; i++) {
                var luck = functions.randint(1, 60)
                if (luck <= 40) {
                    chaves += Math.round(Math.random())
                    caixas += Math.round(Math.random())
                    falcoins += functions.randint(500, 15000)
                } 
            }
            functions.changeDB(user.id, 'chaves', chaves-quantity)
            functions.changeDB(user.id, 'caixas', caixas-quantity)
            functions.changeDB(user.id, 'falcoins', falcoins)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .addField(instance.messageHandler.get(guild, "CAIXA_TITULO", {QUANTITY: args[0]}), `:key: ${chaves}\n:coin: ${await functions.format(falcoins)} \n:gift: ${caixas}`)
            .setFooter({text: 'by Falcão ❤️'})
            return embed
        } else {
            return instance.messageHandler.get(guild, "CAIXA_INSUFICIENTE", {VALUE: args[0]})
        }
        } catch (error) {
            console.error(`crate: ${error}`)
        }
    }
}