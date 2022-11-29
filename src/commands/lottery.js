const fs = require("fs")
const { MessageEmbed } = require("discord.js")
const {
	readFile,
	changeDB,
	msToTime,
	format,
} = require("../utils/functions.js")
const { testOnly } = require("../config.json")

module.exports = {
	category: "Economia",
	description: "Lottery",
	slash: true,
	cooldown: "1s",
	guildOnly: true,
	testOnly,
	options: [
		{
			name: "view",
			description: "View lottery info",
			type: "SUB_COMMAND",
		},
		{
			name: "buy",
			description: "Buy lottery tickets",
			type: "SUB_COMMAND",
			options: [
				{
					name: "amount",
					description: "Amount of lottery tickets to buy",
					required: true,
					type: "NUMBER",
				},
			],
		},
	],
	callback: async ({ instance, guild, user, interaction }) => {
		try {
			type = interaction.options.getSubcommand()
			if (type === "buy") {
				amount = interaction.options.getNumber("amount")
				if (
					(await readFile(user.id, "falcoins")) > amount * 500 &&
					amount > 0
				) {
					var embed = new MessageEmbed()
						.setColor("GOLD")
						.addFields({
							name:
								`:tickets: ${await format(amount)} ` +
								instance.messageHandler.get(guild, "PURCHASED"),
							value: instance.messageHandler.get(guild, "LOTTERY_COST", {
								COST: await format(amount * 500),
							}),
						})
						.setFooter({ text: "by Falcão ❤️" })

					await changeDB(user.id, "falcoins", -(amount * 500))
					await changeDB(user.id, "tickets", amount)

					await interaction.reply({
						embeds: [embed],
					})
				} else if (amount <= 0) {
					return instance.messageHandler.get(guild, "VALOR_INVALIDO", {
						VALUE: amount,
					})
				} else {
					return instance.messageHandler.get(guild, "FALCOINS_INSUFICIENTES")
				}
			} else {
				var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"))
				var embed = new MessageEmbed()
					.setColor("GOLD")
					.addFields(
						{
							name: instance.messageHandler.get(guild, "LOTTERY"),
							value: instance.messageHandler.get(guild, "LOTTERY_POOL", {
								PRIZE: await format(config["lottery"]["prize"]),
							}),
							inline: false,
						},
						{
							name: "Info",
							value: instance.messageHandler.get(guild, "LOTTERY_INFO", {
								TIME: await msToTime(
									config["lottery"]["drawTime"] - Date.now()
								),
							}),
							inline: false,
						}
					)
					.setFooter({ text: "by Falcão ❤️" })

				if ((await readFile(user.id, "tickets")) > 0) {
					embed.fields[0].value += instance.messageHandler.get(
						guild,
						"LOTTERY_TICKETS",
						{
							TICKETS: await readFile(user.id, "tickets", true),
						}
					)
				}

				await interaction.reply({
					embeds: [embed],
				})
			}
		} catch (err) {
			console.error(`lottery: ${err}`)
		}
	},
}
