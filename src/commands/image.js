const {Constants, MessageEmbed} = require('discord.js')
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const {randint, getRoleColor} = require('../utils/functions.js')
const {testOnly} = require("../config.json")

module.exports =  {
    aliases: ['imagem', 'foto'],
    category: 'Fun',
    description: 'show a random image from google based on the search query',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    minArgs: 1,
    expectedArgs: '<search>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name:'search',
        description: 'the search query',
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
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

            const embed = new MessageEmbed()
            .setColor(await getRoleColor(guild, user.id))
            .setTitle(`${text}`)
            .setImage(photos.result[randint(0,photos.result.length - 1)].url)
            .setFooter({text: 'by Falcão ❤️'})
            if (message) {return embed} else {interaction.editReply({embeds: [embed]})}
        } catch (error) {
            console.error(`image: ${error}`)
        }
    }
}   