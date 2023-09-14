# ✔️ Contributing guidelines

Be sure to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and these guidelines when contributing to the project.

## 🤔 How to open an issue?

1. Check that you are logged in to your GitHub account.
2. Open the [issues page](https://github.com/falcao-g/Falbot/issues) available in the repository menu.
3. Click in "New issue", this button will open a new page where you can select the issue type.
4. Select the issue type, currently you can open a bug report or a feature request.
5. Fill in the formulary and click in "Submit new issue".

## 🤝 How to open a pull request?

1. Fork the repository.
2. Clone the forked repository.
3. Create a new branch with the name of the feature you are working on.
4. Make the necessary changes and make a commit.
5. After that, push to the forked repository.
6. After the push, acess the forked repository on Github and click in "Compare & pull request".

## 🚨 Self-hosting warning

Please keep in mind that Falbot's emojis aren't distributed with the source code, so if you try to run commands that use them, you will get an error.

I don't know exactly how to ammend this, but if you create your own emojis with the same names, it should work.

## ⚡ How to run

### 👷 Requirements

- Node.js
- A MongoDB database

### 🧹 Preparing the enviroment

Clone this git repository somewhere in your OS, then open the cloned folder with a terminal of your choice and run `npm i`

When all of the dependencies finish installing, you will need to create a `config.json` file inside the `src` folder and paste this on it:

```json
{
	"devs": [""],
	"testGuilds": [""]
}
```

- "devs": put here the discord id of all developers of the bot, this will be important to manage slash commands
- "testGuilds": your guilds for testing, developer commands will only register here and the bot will import custom emojis from this servers

In addition, you will also need to remove the `.example` from the `.env.example` file and fill it like this:

- "TOKEN": your discord bot token
- "MONGODB_URI": your mongodb connection uri
- "Authorization": this is only required if your bot is in top.gg and you plan to use the /vote command, in this case you go to <https://top.gg/bot/:yourbotid/webhooks> and put the token here, otherwise just ignore this

### 🏃‍♂️ Running

If everything was done correctly, you just need to open a terminal on the folder and run `npm start` and the bot should be up and running!
