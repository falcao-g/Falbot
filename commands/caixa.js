const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Gasta 1 chave e 1 caixa para ter a chance de ganhar alguns prêmios',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    testOnly: false,
    expectedArgs: '<quantidade>',
    expectedArgsTypes: ['NUMBER'],
    options: [{
        name: 'quantidade',
        description: 'quantidade de caixas que você ira abrir',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
    }],
    callback: async ({message, interaction, args}) => {
        try {
            functions.createUser(message ? message.author.id : interaction.user.id)
            args[0] = parseInt(args[0])
        if (await functions.readFile(message ? message.author.id : interaction.user.id, 'Caixas') >= args[0] && await functions.readFile(message ? message.author.id : interaction.user.id, 'Chaves') >= args[0]) {
            if (interaction) {
                interaction.reply({
                    content: 'Sucesso! suas caixas já serão abertas :money_mouth:'
                })
            }
            for (let i = 0; i < args[0]; i++) {
                var luck = functions.randint(1, 60)
                if (luck <= 40) {
                    chaves = Math.round(Math.random())
                    caixas = Math.round(Math.random())
                    falcoins = functions.randint(500, 15000)
                    functions.changeJSON(message ? message.author.id : interaction.user.id, 'Chaves', chaves-1)
                    functions.changeJSON(message ? message.author.id : interaction.user.id, 'Caixas', caixas-1)
                    functions.changeJSON(message ? message.author.id : interaction.user.id, 'Falcoins', falcoins)
                } else {
                    chaves = 0
                    caixas = 0
                    falcoins = 0
                    functions.changeJSON(message ? message.author.id : interaction.user.id, 'Chaves', -1)
                    functions.changeJSON(message ? message.author.id : interaction.user.id, 'Caixas', -1)   
                }
                const embed = new Discord.MessageEmbed()
                .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
                .addField('Caixa', `Você ganhou ${chaves} chaves\nVocê ganhou ${falcoins} falcoins\nVocê ganhou ${caixas} caixas`)
                .setFooter('by Falcão ❤️')
                if (message) {
                    await message.channel.send({
                        embeds: [embed]
                    })
                } else {
                    interaction.channel.send({
                        embeds: [embed]
                    })
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } else {
            return 'você não tem caixas e/ou chaves o suficiente para esta ação! :rage:'
        }
        } catch (error) {
            console.log('Caixa:', error)
        }
    }
}
