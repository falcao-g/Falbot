# Falbot 🪙

Falbot is a economy and user interaction focused bot, with features like:

🎲 Gamble commands

⚔️ User interaction betting falcoins

🎉 Fun commands

⚙️ Useful commands

👑 Engaging level-up and progression system

🌎 All features available in both portuguese and english

Use /help to get started, Falbot is updated frequently, if you want to earn huge amounts of money or just have some fun with your friends, this bot is for you

Add him in: <https://top.gg/bot/742331813539872798>

Official website: <https://falbot.netlify.app/>

## 📩 Inviting Falbot to your server

You can add the bot's public instance by [clicking here](https://discord.com/oauth2/authorize?client_id=742331813539872798&permissions=330816&scope=bot%20applications.commands), this way you don't have to worry about hosting and other stuff

## 🚀 Self-hosting conditions and warnings

In addition to the project's license, here are some other things that you should keep in mind:

1. I keep the source code open so people can see, learn and be inspired by how Falbot was made and, if they want to, they can help the project with features and bug fixes.

2. If you change the code, you need to follow Falbot's license and keep the changes open source. And if you want to help in Falbot's development, why not create a pull request?

3. I won't give support for selfhosted instances, you need to know how to troubleshoot the issues yourself, if you find any.

4. Don't lie saying that you "created Falbot". Please give credits to the creator!

5. Falbot's emojis aren't distributed with the source code, you will need to create and include your own assets.

Seems too hard but you really want to use Falbot? Don't worry, you can use our free public instance by [clicking here](https://discord.com/oauth2/authorize?client_id=742331813539872798&permissions=330816&scope=bot%20applications.commands)!

## 👷 Requirements

- Node.js
- A MongoDB database

## 🧹 Preparing the enviroment

Clone this git repository somewhere in your OS, then open the cloned folder with a terminal of your choice and run `npm i`

When all of the dependencies finish installing, you will need to create a `config.json` file inside the `src` folder and paste this on it:

```json
{
 "owners": ["OWNERS_ID"],
 "someServers": ["SERVERS_ID"],
 "language": "portugues",
 "poupanca": {
  "last_interest": "0",
  "interest_time": "86400000",
  "interest_rate": "0.1"
 },
 "testOnly": true
}
```

In addition, you will also need to create a .env file outside the `src` folder, where the index.js file is, and paste this on it:

```json
TOKEN="token"
MONGODB_URI="mongodb_uri"
Authorization="topgg-core-authorization"
```

## ⚙ Configuring

Falbot is made to be a really configurable bot:

.env file:

- "TOKEN": your discord bot token
- "MONGODB_URI": your mongodb connection uri
- "Authorization": this is only required if your bot is in top.gg and you plan to use the /vote command, in this case you go to <https://top.gg/bot/:yourbotid/webhooks> and put the token here, otherwise just ignore this

config.json file:

- "owners": put here your discord id and other people that will be involved in development, this will be important to manage slash commands
- "someServers": the server or servers id that will be used to test the bot
- "language": the default language of the bot
- "poupanca": this defines some things about the bank's interest of the bot
  - "last_interest": don't touch this, the code uses this to know when was the last interest increase
  - "interest_time": how much time between interests in milisseconds, default is 24h
  - "interest_rate": how much % the interest increases, default is 10%
- "testOnly": when you are only testing the slash commands put this as true this way you don't have to wait 1 hour for the command to register, it register instantly in the servers you put earlier

## 🏃‍♂️ Running

If everything was done correctly, you just need to open a terminal on the folder and run `node .` and the bot should be up and running!
