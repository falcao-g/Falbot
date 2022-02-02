const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Gasta 1 chave e 1 caixa para ter a chance de ganhar alguns prêmios',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<quantidade>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantidade',
        description: 'quantidade de caixas que você ira abrir',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({message, interaction, user, args}) => {
        try {
            functions.createUser(user.id)
            try {
                var quantity = await functions.specialArg(args[0], user.id, "Caixas")
            } catch {
                return `${args[0]} não é um valor válido... :rage:`
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
            .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
            .addField(`Você abriu ${quantity} caixas`, `Você ganhou ${chaves} chaves\nVocê ganhou ${falcoins} falcoins\nVocê ganhou ${caixas} caixas`)
            .setFooter('by Falcão ❤️')
            return embed
        } else {
            return 'você não tem caixas e/ou chaves o suficiente para esta ação! :rage:'
        }
        } catch (error) {
            console.error(`Caixa: ${error}`)
        }
    }
}
