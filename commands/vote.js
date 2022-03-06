const Discord = require('discord.js')
const config = require("../config/config.json")
const functions = require('../functions.js')
const top = require('top.gg-core');

module.exports =  {
    aliases: ['voto'],
    category: 'Economia',
    description: 'Earn falcoins by voting for us on top.gg',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly: config.testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            const topgg = new top.Client(config.Authorization)

            if (await topgg.isVoted(user.id) && (Date.now() - await functions.readFile(user.id, 'lastVote') > 43200000)) {
                await functions.changeDB(user.id, 'lastVote', Date.now(), true)
                await functions.changeDB(user.id, 'falcoins', 5000)
                const embed = new Discord.MessageEmbed()
                .setColor(3066993) 
                .addField(instance.messageHandler.get(guild, "VOCE_GANHOU"), `**5000** falcoins`)
                .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `**${await functions.readFile(user.id, 'falcoins', true)}** falcoins`)
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else if (await topgg.isVoted(user.id) && (Date.now() - await functions.readFile(user.id, 'lastVote') < 43200000)) {
                const embed = new Discord.MessageEmbed()
                .setColor(15158332) 
                .addField('Você já coletou sua recompensa hoje', `Recompensa: **5000** falcoins\nVocê pode coletar de novo em **${await functions.msToTime(43200000 - (Date.now() - await functions.readFile(user.id, 'lastVote')))}**`)
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else {
                const embed = new Discord.MessageEmbed()
                .setTitle('Você precisa votar primeiro para conseguir sua recompensa')
                .setColor('#0099ff')
                .setDescription('[Você pode votar aqui](https://top.gg/bot/742331813539872798/vote)')
                .addField('Recompensa', '**5000** falcoins\nUse esse comando de novo após ter votado no bot')
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            }
        } catch (error) {
            console.error(`vote: ${error}`)
        }
    }
}   