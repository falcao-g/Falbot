const {convertColor, convertCoordinate} = require('../utils/functions.js')
const {testOnly} = require("../config.json")
const canvas = require("../utils/json/place.json")
const fs = require("fs");

module.exports =  {
    category: 'Fun',
    description: 'Similar to the r/place subrredit, but with discord emojis',
    slash: 'both',
    cooldown: '1s',
    guildOnly: true,
    testOnly,
    expectedArgs: '<color> <coordinate>',
    expectedArgsTypes: ['STRING', 'STRING'],
    options: [
    {
        name: 'color',
        description: 'The color you want to place',
        type: "STRING",
        required: false,
        choices: [{name: 'white', value: 'white'}, {name: 'orange', value:'orange'},
        {name: 'blue', value:'blue'}, {name: 'black', value: 'black'}, {name: 'green', value:'green'},
        {name: 'red', value:'red'}, {name: 'brown', value:'brown'}, {name: 'purple', value:'purple'},
        {name: 'yellow', value:'yellow'},]
    },
    {
        name: 'coordinate',
        description: 'The coordinate you want to place the color at',
        type: "STRING",
        required: false
    }
    ],
    callback: async ({instance, guild, message, args, interaction}) => {
        try {
            // getting the right arguments
            if (message) {
                var color = args[0]
                var coordinate = args[1]
            } else {
                var color = interaction.options.getString('color')
                var coordinate = interaction.options.getString('coordinate')
            }

            if (typeof color === 'string' && typeof coordinate === 'string') {
                // getting the right emoji
                try {
                    color = await convertColor(color)
                } catch {
                    return instance.messageHandler.get(guild, 'PLACE_INVALID_COLOR')
                }

                //converting coordinate to a number
                try {
                    coordinate = await convertCoordinate(coordinate)
                } catch {
                    return instance.messageHandler.get(guild, 'PLACE_INVALID_COORD')
                }

                // inserting the emoji into the canvas
                canvas[coordinate-1] = color

                // saving the canvas
                canvasStringify = JSON.stringify(canvas, null, 2)
                fs.writeFileSync("./src/utils/json/place.json", canvasStringify, "utf8", function (err) {
                    if (err) throw err;
                });
            } else if (typeof color === 'string' && typeof coordinate !== 'string') {
                return instance.messageHandler.get(guild, "PLACE_NOT_COORD")
            } else if (typeof coordinate === 'string' && typeof color !== 'string') {
                return instance.messageHandler.get(guild, "PLACE_NOT_COLOR")
            }
            let canvasString = 
            `:black_large_square:  :one::two::three::four::five::six::seven::eight::nine:\n` +
            `:regional_indicator_a:  ${canvas.slice(0, 9).join('')}\n` +
            `:regional_indicator_b:  ${canvas.slice(9, 18).join('')}\n` +
            `:regional_indicator_c:  ${canvas.slice(18, 27).join('')}\n` +
            `:regional_indicator_d:  ${canvas.slice(27, 36).join('')}\n` +
            `:regional_indicator_e:  ${canvas.slice(36, 45).join('')}\n` +
            `:regional_indicator_f:  ${canvas.slice(45, 54).join('')}\n` +
            `:regional_indicator_g:  ${canvas.slice(54, 63).join('')}\n` +
            `:regional_indicator_h:  ${canvas.slice(63, 72).join('')}\n` +
            `:regional_indicator_i:  ${canvas.slice(72, 81).join('')}\n`
            
            return canvasString
        } catch (error) {
            console.error(`place: ${error}`)
        }
    }
}   