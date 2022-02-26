const Discord = require('discord.js')
const functions = require('../functions.js')
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'Gasta 1 chave e 1 caixa para ter a chance de ganhar alguns prêmios',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    testOnly: config.testOnly,
    expectedArgs: '<quantidade>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantidade',
        description: 'quantidade de caixas que você ira abrir',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({instance, guild, user, args}) => {
        try {
            try {
                var quantity = await functions.specialArg(args[0], user.id, "Caixas")
            } catch {
                return instance.messageHandler.get(guild, "VALOR_INVALIDO", {VALUE: args[0]})
            }
        if (await functions.readFile(user.id, 'Caixas') >= quantity && await functions.readFile(user.id, 'Chaves') >= quantity) {
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
            functions.changeJSON(user.id, 'Chaves', chaves-quantity)
            functions.changeJSON(user.id, 'Caixas', caixas-quantity)
            functions.changeJSON(user.id, 'Falcoins', falcoins)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .addField(instance.messageHandler.get(guild, "CAIXA_TITULO", {QUANTITY: args[0]}), `:key: ${chaves}\n:coin: ${await functions.format(falcoins)} \n:gift: ${caixas}`)
            .setFooter({text: 'by Falcão ❤️'})
            return embed
        } else {
            return instance.messageHandler.get(guild, "CAIXA_INSUFICIENTE", {VALUE: args[0]})
        }
        } catch (error) {
            console.error(`Caixa: ${error}`)
        }
    }
}