const {testOnly} = require("../config.json")
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js')

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
            choices: [{name: "allcommands", value: "allcommands"}, {name: "ranks", value: "ranks"},
            {name: "economy", value: "economy"}, {name: "fun", value: "fun"},
            {name: "language", value: "language"}, {name: "utils", value: "utils"}]
        }
    ],
    testOnly,
    callback: async ({args, message, instance, guild, interaction}) => {
        try {
            if (!interaction) {
                if (args[0] !== undefined) {
                    var page = args[0].toLowerCase()
                }
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
            if (page === "allcommands") {
                embed.setTitle(instance.messageHandler.get(guild, "ALL_COMMANDS"))
                embed.addField(instance.messageHandler.get(guild, "TOO_MANY"), instance.messageHandler.get(guild, "LINK_COMMANDS"))
            } else if (page === "ranks") {
                embed.setTitle(':magic_wand: Ranks')
                embed.addField(instance.messageHandler.get(guild, "HELP_RANK"), instance.messageHandler.get(guild, "HELP_RANK2"))
            } else if (page === "economy") {
                embed.addField(instance.messageHandler.get(guild, "HELP_ECONOMY2"), instance.messageHandler.get(guild, "HELP_ECONOMY3"))
            } else if (page === "fun") {
                embed.addField(instance.messageHandler.get(guild, "HELP_FUN"), instance.messageHandler.get(guild, "HELP_FUN2"))
            } else if (page === "language") {
                embed.setTitle(instance.messageHandler.get(guild, "HELP_LANGUAGE"))
                embed.addField(instance.messageHandler.get(guild, "HELP_LANGUAGE2"), instance.messageHandler.get(guild, "HELP_LANGUAGE3"))
            } else if (page === "utils") {
                embed.addField(instance.messageHandler.get(guild, "HELP_UTILS"), instance.messageHandler.get(guild, "HELP_UTILS2"))
            } else {
                embed.setTitle(instance.messageHandler.get(guild, "FALBOT_WELCOME"))
                embed.addFields({
                    name: ":books: " + instance.messageHandler.get(guild, "COMMANDS_ALL"),
                    value: instance.messageHandler.get(guild, "COMMANDS_ALL2"),
                    inline: true
                }, {
                    name: ":magic_wand: Ranks",
                    value: instance.messageHandler.get(guild, "HELP_RANK3"),
                    inline: true
                }, {
                    name: ":money_with_wings: " + instance.messageHandler.get(guild, "ECONOMY"),
                    value: instance.messageHandler.get(guild, "HELP_ECONOMY"),
                    inline: true
                }, {
                    name: ":tada: " + instance.messageHandler.get(guild, "FUN"),
                    value: instance.messageHandler.get(guild, "HELP_FUN3"),
                    inline: true
                }, {
                    name: ":earth_americas: " + instance.messageHandler.get(guild, "LANGUAGE"),
                    value: instance.messageHandler.get(guild, "HELP_LANGUAGE4"),
                    inline: true
                }, {
                    name: ":pencil: " + instance.messageHandler.get(guild, "UTILS"),
                    value: instance.messageHandler.get(guild, "HELP_UTILS3"),
                    inline: true
                })
            }
            const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                 .setCustomId("page")
                 .setPlaceholder(instance.messageHandler.get(guild, "PICK_PAGE"))
                 .addOptions({
                    label: instance.messageHandler.get(guild, "COMMANDS_ALL"),
                    value: "allcommands",
                    emoji: "📚"
                 }, {
                    label: "Ranks",
                    value: "ranks",
                    emoji: "🪄"
                 }, {
                    label: instance.messageHandler.get(guild, "ECONOMY"),
                    value: "economy",
                    emoji: "💸"
                 }, {
                    label: instance.messageHandler.get(guild, "FUN"),
                    value: "fun",
                    emoji: "🎉"
                 }, {
                    label: instance.messageHandler.get(guild, "LANGUAGE"),
                    value: "language",
                    emoji: "🌎"
                 }, {
                    label: instance.messageHandler.get(guild, "UTILS"),
                    value: "utils",
                    emoji: "📝"
                 })
            )
            if (interaction) {
                await interaction.reply({embeds: [embed], components: [row]})
            } else {
                await message.reply({embeds: [embed], components: [row]})
            }
        } catch (error) {
            console.error(`Help: ${error}`)
        }
    }
}