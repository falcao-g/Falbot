# Falbot 🪙

Falbot is a fun brazilian bot, with major focus in economy, featuring:

🎲 Gamble commands

⚔️ Competitive commands

📈 Engaging rank-up and progression system

🏛️ Dynamic economy run by player activity

👑 Global and local user leaderboards

🎉 Fun commands

⚙️ Useful commands

🌎 All features available in both portuguese and english

See the introduction page in /help command to get started, don’t miss the opportunity to have a unique and enriching experience on your Discord server with Falbot!

Add him in: <https://top.gg/bot/742331813539872798>

Official website: <https://falbot.netlify.app/>

![Discord Bots](https://top.gg/api/widget/upvotes/742331813539872798.svg)

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
 "devs": [""],
 "testGuild": "",
 "language": "portugues",
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

- "devs": put here the discord id of all developers of the bot, this will be important to manage slash commands
- "testGuild": id of the guild used to test commands
- "language": the default language of the bot (portuguese or english)
- "testOnly": when you are only testing the slash commands put this as true this way you don't have to wait 1 hour for the command to register, it register instantly in the servers you put earlier

## 🏃‍♂️ Running

If everything was done correctly, you just need to open a terminal on the folder and run `node .` and the bot should be up and running!
