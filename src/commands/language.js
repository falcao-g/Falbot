module.exports = {
    category: 'uteis',
    description: 'Sets the language of the server or the user',
    expectedArgs: '[language]',
    maxArgs: 1,
    slash: 'both',
    cooldown: '1s',
    guildOnly: false,
    permissions: ['ADMINISTRATOR'],
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'language',
        description: 'the desired language of the server or the user',
        required: false,
        type: "STRING"
    }],
    callback: async ({instance, guild, text, user}) => {
        try {
            languageSchema = instance._mongoConnection.models['wokcommands-languages']
            const lang = text.toLowerCase()
            if (guild) {
                if (!lang) {
                    return instance.messageHandler.get(guild, 'CURRENT_LANGUAGE', {
                        LANGUAGE: instance.messageHandler.getLanguage(guild),
                    })
                }
                instance.messageHandler.setLanguage(guild, lang)

                await languageSchema.findOneAndUpdate(
                    {
                      _id: guild.id,
                    },
                    {
                      _id: guild.id,
                      language: lang,
                    },
                    {
                      upsert: true,
                    }
                )

                return instance.messageHandler.get(guild, 'NEW_LANGUAGE', {
                    LANGUAGE: lang,
                  })
            } else {
                if (!lang) {
                    return instance.messageHandler.get(guild, 'CURRENT_LANGUAGE', {
                        LANGUAGE: instance.messageHandler.getLanguage(guild),
                    })
                }
                instance.messageHandler.setLanguage(user, lang)

                await languageSchema.findOneAndUpdate(
                    {
                      _id: user.id,
                    },
                    {
                      _id: user.id,
                      language: lang,
                    },
                    {
                      upsert: true,
                    }
                )

                return instance.messageHandler.get(user, 'NEW_LANGUAGE', {
                    LANGUAGE: lang,
                  })
            }


        } catch (error) {
            console.error(`language: ${error}`)
        }
    }
}