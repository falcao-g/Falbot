const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Mostra as informações da pessoa marcada',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: false,
    minArgs: 1,
    expectedArgs: '<sobre>',
    expectedArgsTypes: ['USER'],
    options: [{
        name: 'usuario',
        description: 'o usuario que você quer ver as informações',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({message, interaction, args}) => {
        try {
            if (message) {
                if (args[0][2] == '!') {
                    args[0] = args[0].slice(3,-1)
                } else {
                    args[0] = args[0].slice(2,-1)
                }
            }
            functions.createUser(args[0])
            const member = await functions.getMember(message ? message : interaction, args[0])
            const user = await functions.readFile(member.user.id)
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, member.user.id))
            .setAuthor(member.user.username, member.user.avatarURL())
            .setFooter('by Falcão ❤️')
            .addFields({
                name: ':coin: Falcoins',
                value: `${await functions.format(user['Falcoins'])}`,
                inline: true
            },{
                name: ':trophy: Vitorias',
                value: `${await functions.format(user['Vitorias'])}`,
                inline: true
            }, {
                name: ':bank: Banco',
                value: `${await functions.format(user['Banco'])}`,
                inline: true
            }, {
                name: ':gift: Caixas',
                value: `${await functions.format(user['Caixas'])}`,
                inline: true
            }, {
                name: ':key: Chaves',
                value: `${await functions.format(user['Chaves'])}`,
                inline: true
            }) 
    
            return embed
        } catch (error) {
                console.log('sobre:', error)
        }
    }
}
