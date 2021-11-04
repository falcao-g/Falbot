const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports =  {
    category: 'Economia',
    description: 'Mostra as informações da pessoa marcada',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<sobre>',
    expectedArgsTypes: ['USER'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`sobre {ARGUMENTS}',
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
            const member = await functions.getMember(message ? message : interaction, args[0])
            const user = await functions.readFile(member.user.id)
            if (user == undefined) {
                return 'Esse usuário não possui um regisro :confused:'
            }
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, member.user.id))
            .setAuthor(member.user.username, member.user.avatarURL())
            .setFooter('by Falcão ❤️')
            .addFields({
                name: ':coin: Falcoins',
                value: `${user['Falcoins']}`,
                inline: true
            },{
                name: ':trophy: Vitorias',
                value: `${user['Vitorias']}`,
                inline: true
            }, {
                name: ':bank: Banco',
                value: `${user['Banco']}`,
                inline: true
            }, {
                name: ':gift: Caixas',
                value: `${user['Caixas']}`,
                inline: true
            }, {
                name: ':key: Chaves',
                value: `${user['Chaves']}`,
                inline: true
            }) 
    
            return embed
        } catch (error) {
                console.log('sobre:', error)
        }
    }
}