# Falbot 🪙

Falbot is a economy and user interaction focused bot, with features like:

🎲 Gamble commands

⚔️ User interaction betting falcoins

🎉 Fun commands

⚙️ Useful commands

Use /commands to get started, Falbot is updated frequently, if you want to earn huge amounts of money or just have some fun with your friends, this bot is for you

Add him in: https://top.gg/bot/742331813539872798

Official website: https://falbot.netlify.app/

## 📩 Inviting Falbot to your server

You can add the bot's public instance by [clicking here](https://discord.com/oauth2/authorize?client_id=742331813539872798&permissions=330816&scope=bot%20applications.commands), this way you don't have to worry about hosting and other stuff

## 🚀 Self-hosting

The public instance doesn't work for you or you want to help contribute to the project? No problem! You can also run Falbot in your own machine

### 👷 Requirements

* Node.js
* A MongoDB database

### 🧹 Preparing the enviroment
Clone this git repository somewhere in your OS, then open the cloned folder with a terminal of your choice and run ```npm i```

When all of the dependencies finish installing, you will also need to create a ```config/config.json``` file and paste this on it: 
```
{
 "TOKEN": "token",
 "PREFIX": "?",
 "MONGODB_URI": "mongodb_uri",
 "owners": [
  "owner_id"
 ],
 "someServers": [
  "server_id"
 ],
 "language": "portugues",
 "poupanca": {
  "last_interest": "0",
  "interest_time": "86400000",
  "interest_rate": "0.01"
 },
 "testOnly": true,
 "Authorization": "topgg-core-authorization"
}
```

Falbot is made to be a really configurable bot:
- "TOKEN": your discord bot token
- "PREFIX": by default "?" is the default prefix, but you can change it here
- "MONGODB_URI": your mongodb connection uri
- "owners": put here your discord id and other people that will be involved in development, this will be important to manage slash commands
- "someServers": the server or servers id that will be used to test the bot
- "language": the default language of the bot
- "poupanca": this defines some things about the bank's interest of the bot
- - "last_interest": don't touch this, the code uses this to know when whas the last interest increase
- - "interest_time": how much time between interests in milisseconds, default is 24h
- - "interest_rate": how much % the interest increases, default is 1%
- "testOnly": when you are only testing the slash commands put this as true this way you don't have to wait 1 hour for the command to register, it register instantly in the servers you put earlier
- "Authorization": this is only required if your bot is in top.gg and you plan to use the /vote command, in this case you go to https://top.gg/bot/:yourbotid/webhooks and put the token here, otherwise just ignore this

### 🏃‍♂️ Running
If everything was done correctly, you just need to open a terminal on the folder and run ```node .``` and the bot should be up and running!
