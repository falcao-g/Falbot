const Discord = require('discord.js')
const functions = require('../functions.js')
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const config = require("../config/config.json")

module.exports =  {
    category: 'Economia',
    description: 'pesquisa fotos pelo termo dado e retorna uma aleatoria',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<termo>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name:'termo',
        description: 'termo que o bot vai pesquisar a imagem por',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, user, args}) => {
        try {
            const photos = await GOOGLE_IMG_SCRAP({
                search: args[0],
                limit: 100,
                safeSearch: true,
            });

            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(message ? message : interaction, user.id))
            .setTitle(`${args[0]}`)
            .setImage(photos.result[functions.randint(0,photos.result.length - 1)].url)
            .setFooter({text: 'by Falcão ❤️'})
            return embed
        } catch (error) {
            console.error(`foto: ${error}`)
        }
    }
}   