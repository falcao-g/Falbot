const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    aliases: ['níquel'],
    category: 'Economia',
    description: 'aposte seu dinheiro no caça-níquel',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    expectedArgs: '[numero] [quantidade]',
    expectedArgsTypes: ['NUMBER', 'NUMBER'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`loja {ARGUMENTS}',
    options: [
    {
        name: 'numero',
        description: 'numero do item que você deseja comprar',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    },
    {
        name: 'quantidade',
        description: 'quantos desse item você deseja comprar',
        required: false,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }
    ],
    callback: async ({message, interaction, args}) => {
        try {
            if (args[0] === undefined && args[1] === undefined) {
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                .setTitle('**Loja**')
                .addFields({
                    name: 'Item número 1: Caixa',
                    value: 'Pelo custo de 5.000 falcoins você compra uma caixa que pode ser aberta usando uma chave',
                    inline: false
                }, {
                    name: 'Item número 2: Chave',
                    value: 'Pelo custo de 20.000 falcoins você compra uma chave que pode ser usada para abrir uma caixa',
                    inline: false
                })
                .setFooter('by Falcão ❤️')
                return embed
            } else {
                item = parseInt(args[0])
                if (item <= 0 || item > 2 || item != item) {
                    return 'item inválida! :rage:'
                }
    
                amount = parseInt(args[1] || 1)
                if (amount <= 0) {
                    return 'quantidade inválida! coloque um número positivo ou deixe em branco para comprar 1 :face_with_monocle:'
                }
    
                if (amount > 100) {
                    return 'calma lá amigão, o limite é 100 itens por vez :wink:'
                }

                if (item === 1) {
                    if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= 5000 * amount) {
                        for (let i = 0; i < amount; i++) {
                            await functions.takeAndGiveButNot(message ? message.author.id : interaction.user.id, message ? message.author.id : interaction.user.id, 'Falcoins', 'Caixas', 5000 * amount, 1 * amount)
                        }
                        return `Parabéns! Você comprou ${amount} caixas :star_struck:`
                    } else {
                        return 'você não tem falcoins suficiente para comprar esse item! :rage:'
                    }
                } else if (item === 2) {
                    if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Falcoins') >= 20000 * amount) {
                        await functions.takeAndGiveButNot(message ? message.author.id : interaction.user.id, message ? message.author.id : interaction.user.id, 'Falcoins', 'Chaves', 20000 * amount, 1 * amount)
                        return `Parabéns! Você comprou ${amount} chaves :star_struck:`
                    } else {
                        return 'você não tem falcoins suficiente para comprar esse item! :rage:'
                    }
                }
            }
        } catch (error) {
            if (error.message.includes("Cannot read property 'Falcoins' of undefined")) {
                return 'registro não encontrado! :face_with_spiral_eyes:\npor favor use /cria para criar seu registro e poder usar os comandos de economia'
            } else {
                console.log('loja:', error)
            }
        }
    }
}   