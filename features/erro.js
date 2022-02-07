const functions = require('../functions.js')


module.exports = (client) => {
    client.on("error", async (error) => {
        console.log(error)
    });
}