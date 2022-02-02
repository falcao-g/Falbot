const functions = require('../functions.js')


module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false;
    
        if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;
    
        if (message.mentions.has(client.user.id)) {
            text = ''
            for (c in message.content) {
                if ('abcdefghijklmnopqrstuvwxyzí'.includes(message.content[c].toLowerCase()) ) { 
                    text += message.content[c]
                }
            }
            message.reply({
                embeds: [await functions.explain(text || '')]
            }) 
        }
    });
}

module.exports.config = {
displayName: 'mention',
dbName: 'explain_mention'
}
