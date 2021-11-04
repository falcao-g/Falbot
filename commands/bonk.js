const Discord = require('discord.js')
const functions = require('../functions.js')

module.exports = {
    category: 'Misc',
    description: 'Manda alguém para a horny jail',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    minArgs: 1,
    expectedArgs: '<usuario>',
    expectedArgsTypes: ['USER'],
    syntaxError: 'uso incorreto! faça `{PREFIX}`bonk {ARGUMENTS}',
    options: [{
        name: 'usuario',
        description: 'usuario que vai ser mandado para a horny jail',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.USER
    }],
    callback: async ({message, interaction, args}) => {
        try {
            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, message ? message.author.id : interaction.user.id))
            .setImage('https://i.kym-cdn.com/photos/images/original/002/051/072/a4c.gif')
            .setFooter('by Falcão ❤️')
           if (message) {
               await message.reply({
                   embeds: [embed] 
               })
           } else {
               const member = await functions.getMember(interaction, args[0])
               await interaction.reply({
                   content: `${member} você foi bonked por ${interaction.user.username}`,
                   embeds: [embed]
               })
           }
        } catch (error) {
            console.log('Bonk:', error)
        }
    }
}