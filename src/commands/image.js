const Discord = require('discord.js')
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const functions = require('../utils/functions.js')
const config = require("../config.json")

module.exports =  {
    aliases: ['imagem', 'foto'],
    category: 'Fun',
    description: 'show a random image from google based on the search query',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    minArgs: 1,
    expectedArgs: '<search>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name:'search',
        description: 'the search query',
        required: true,
        type: Discord.Constants.ApplicationCommandOptionTypes.STRING
    }
    ],
    callback: async ({message, interaction, user, guild, text}) => {
        try {
            if (interaction) {await interaction.deferReply()}

            text = text.trim()

            const photos = await GOOGLE_IMG_SCRAP({
                search: text,
                limit: 100,
                safeSearch: true,
            });

            const embed = new Discord.MessageEmbed()
            .setColor(await functions.getRoleColor(guild, user.id))
            .setTitle(`${text}`)
            .setImage(photos.result[functions.randint(0,photos.result.length - 1)].url)
            .setFooter({text: 'by Falcão ❤️'})
            if (message) {return embed} else {interaction.editReply({embeds: [embed]})}
        } catch (error) {
            console.error(`image: ${error}`)
        }
    }
}   