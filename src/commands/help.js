const {testOnly} = require("../config.json")
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js')
const { e } = require("mathjs")

module.exports =  {
    aliases: ['ajuda', 'comandos', 'commands'],
    category: 'uteis',
    description: 'Show commands help and information',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    options: [
        {
            name: 'page',
            description: 'Which help page you want to see',
            required: false,
            type: "STRING",
            choices: [{name: "introduction", value: "introduction"}, {name: "allcommands", value: "allcommands"},
            {name: "ranks", value: "ranks"}, {name: "economy", value: "economy"}, {name: "fun", value: "fun"},
            {name: "language", value: "language"}, {name: "utils", value: "utils"}]
        }
    ],
    testOnly,
    callback: async ({args, message, instance, guild, interaction}) => {
        try {
            if (!interaction) {
                var page = args[0].toLowerCase()
            } else {
                if (interaction.options !== undefined) {
                    var page = interaction.options.getString("page")
                } else {
                    var page = interaction.values[0]
                }
            }
            const embed = new MessageEmbed()
            .setColor("DARK_PURPLE")
            .setFooter({text: 'by Falcão ❤️'})
            if (page === "introduction") {
                // Send introduction message
            } else if (page === "allcommands") {
                embed.setTitle(instance.messageHandler.get(guild, "ALL_COMMANDS"))
                embed.addField(instance.messageHandler.get(guild, "TOO_MANY"), instance.messageHandler.get(guild, "LINK_COMMANDS"))
            } else if (page === "ranks") {
                embed.setTitle(':magic_wand: Ranks')
                embed.addField(instance.messageHandler.get(guild, "HELP_RANK"), instance.messageHandler.get(guild, "HELP_RANK2"))
            } else if (page === "economy") {
                // Send economy message
            } else if (page === "fun") {
                // Send fun message
            } else if (page === "language") {
                embed.setTitle(instance.messageHandler.get(guild, "HELP_LANGUAGE"))
                embed.addField(instance.messageHandler.get(guild, "HELP_LANGUAGE2"), instance.messageHandler.get(guild, "HELP_LANGUAGE3"))
            } else if (page === "utils") {
                embed.addField(':pencil: Falbot também pode ser útil no seu dia-a-dia', '-Mude o prefixo do falbot com `/prefix`\n-Deixe o falbot resolver expressões matemáticas para você com `/math`\n-Role dados usando `/roll`')
            } else {
                embed.setTitle('')  
            }
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                 .setCustomId("page")
                 .setPlaceholder("Pick a help page...")
                 .addOptions({
                    label: "Introduction",
                    value: "introduction"
                 }, {
                    label: "allcommands",
                    value: "allcommands"
                 }, {
                    label: "ranks",
                    value: "ranks"
                 }, {
                    label: "economy",
                    value: "economy"
                 }, {
                    label: "fun",
                    value: "fun"
                 }, {
                    label: "language",
                    value: "language"
                 }, {
                    label: "utils",
                    value: "utils"
                 })
            )
            if (interaction) {
                await interaction.reply({embeds: [embed], components: [row]})
            } else {
                await message.reply({embeds: [embed], components: [row]})
            }
            //console.log(instance.commandHandler.getCommand('help').callback)
            //instance.commandHandler.getCommand('help').callback({args, instance, guild, interaction})
        } catch (error) {
            console.error(`Help: ${error}`)
        }
    }
}