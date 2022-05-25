const {MessageEmbed} = require('discord.js')
const top = require('top.gg-core');
const {changeDB, readFile, msToTime} = require('../utils/functions.js')
const {testOnly} = require("../config.json")
require('dotenv').config()
const {Authorization} = process.env

module.exports =  {
    aliases: ['voto'],
    category: 'Economia',
    description: 'Earn falcoins by voting for us on top.gg',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    callback: async ({instance, guild, user}) => {
        try {
            const topgg = new top.Client(Authorization)

            if (await topgg.isVoted(user.id) && (Date.now() - await readFile(user.id, 'lastVote') > 43200000)) {
                await changeDB(user.id, 'lastVote', Date.now(), true)
                await changeDB(user.id, 'falcoins', 5000)
                const embed = new MessageEmbed()
                .setColor(3066993) 
                .addField(instance.messageHandler.get(guild, "VOCE_GANHOU"), `**5000** falcoins`)
                .addField(instance.messageHandler.get(guild, "SALDO_ATUAL"), `**${await readFile(user.id, 'falcoins', true)}** falcoins`)
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else if (await topgg.isVoted(user.id) && (Date.now() - await readFile(user.id, 'lastVote') < 43200000)) {
                const embed = new MessageEmbed()
                .setColor(15158332) 
                .addField('Você já coletou sua recompensa hoje', `Recompensa: **5000** falcoins\nVocê pode coletar de novo em **${await msToTime(43200000 - (Date.now() - await readFile(user.id, 'lastVote')))}**`)
                .setFooter({text: 'by Falcão ❤️'})
                return embed
            } else {
                const embed = new MessageEmbed()
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