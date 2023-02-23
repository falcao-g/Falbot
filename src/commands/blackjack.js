const {
	specialArg,
	readFile,
	getRoleColor,
	changeDB,
	format,
} = require("../utils/functions.js")
const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} = require("discord.js")
const Blackjack = require("simply-blackjack")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("blackjack")
		.setDescription("Play a game of blackjack")
		.setDescriptionLocalization("pt-BR", "Jogue um jogo de 21")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'the amount of falcoins you want to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setDescriptionLocalization(
					"pt-BR",
					'a quantidade de falcoins para apostar (suporta "tudo"/"metade" e notas como 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, instance, user }) => {
		await interaction.deferReply()
		try {
			const falcoins = interaction.options.getString("falcoins")
			try {
				var bet = await specialArg(falcoins, user.id, "falcoins")
			} catch {
				await interaction.editReply({
					content: instance.getMessage(guild, "VALOR_INVALIDO", {
						VALUE: falcoins,
					}),
				})
				return
			}
			if ((await readFile(user.id, "falcoins")) >= bet) {
				await changeDB(user.id, "falcoins", -bet)

				const Game = new Blackjack({
					decks: 3,
					payouts: {
						blackjack: 2,
						default: 1,
					},
				})
				Game.bet(bet)
				Game.start()

				const enum_cards = {
					A: await guild.emojis.fetch("1078109893099274280"),
					2: await guild.emojis.fetch("1078116892776075374"),
					3: await guild.emojis.fetch("1078116896840364162"),
					4: await guild.emojis.fetch("1078110565064523796"),
					5: await guild.emojis.fetch("1078116898711031828"),
					6: await guild.emojis.fetch("1078116890183991296"),
					7: await guild.emojis.fetch("1078109882999373854"),
					8: await guild.emojis.fetch("1078116894546067466"),
					9: await guild.emojis.fetch("1078110567555928176"),
					10: await guild.emojis.fetch("1078374320394485790"),
					J: await guild.emojis.fetch("1078109887390810232"),
					Q: await guild.emojis.fetch("1078109891513827460"),
					K: await guild.emojis.fetch("1078109890066776155"),
					hidden: await guild.emojis.fetch("1078109885734064128"),
				}

				var player_cards = []
				var dealer_cards = []

				Game.player.forEach((element) => {
					player_cards.push(enum_cards[element.name.substr(0, 2).trim()])
				})

				Game.table.dealer.cards.forEach((element) => {
					dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()])
				})
				dealer_cards.push(enum_cards["hidden"])

				const embed = new EmbedBuilder()
					.addFields(
						{
							name: "BlackJack",
							value: instance.getMessage(guild, "BLACKJACK_TITLE", {
								BET: format(bet),
							}),
							inline: false,
						},
						{
							name: instance.getMessage(guild, "PLAYER_HAND", {
								CARDS: player_cards.join(" "),
							}),
							value: instance.getMessage(guild, "VALUE", {
								VALUE: Game.table.player.total,
							}),
							inline: true,
						},
						{
							name: instance.getMessage(guild, "DEALER_HAND", {
								CARDS: dealer_cards.join(" "),
							}),
							value: instance.getMessage(guild, "VALUE", {
								VALUE: Game.table.dealer.total,
							}),
							inline: true,
						}
					)
					.setColor(await getRoleColor(guild, user.id))
					.setFooter({ text: "by Falcão ❤️" })

				const row = new ActionRowBuilder().addComponents(
					(hit = new ButtonBuilder()
						.setCustomId("hit")
						.setLabel(instance.getMessage(guild, "HIT"))
						.setStyle("Secondary")),
					(stand = new ButtonBuilder()
						.setCustomId("stand")
						.setLabel(instance.getMessage(guild, "STAND"))
						.setStyle("Secondary")),
					(double = new ButtonBuilder()
						.setCustomId("double")
						.setLabel(instance.getMessage(guild, "DOUBLE"))
						.setStyle("Secondary"))
				)

				var answer = await interaction.editReply({
					embeds: [embed],
					components: [row],
					fetchReply: true,
				})

				const filter = (btInt) => {
					return instance.defaultFilter(btInt) && btInt.user.id === user.id
				}

				const collector = answer.createMessageComponentCollector({
					filter,
					time: 1000 * 60 * 30,
				})

				collector.on("collect", async (i) => {
					if (i.customId === "hit") {
						Game.hit()

						double.setDisabled(true)

						if (Game.table.player.total >= 21) {
							Game.stand()
							i.deferUpdate()
						} else {
							var player_cards = []
							var dealer_cards = []

							Game.player.forEach((element) => {
								player_cards.push(enum_cards[element.name.substr(0, 2).trim()])
							})

							Game.table.dealer.cards.forEach((element) => {
								dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()])
							})
							dealer_cards.push(enum_cards["hidden"])

							embed.data.fields[1] = {
								name: instance.getMessage(guild, "PLAYER_HAND", {
									CARDS: player_cards.join(" "),
								}),
								value: instance.getMessage(guild, "VALUE", {
									VALUE: Game.table.player.total,
								}),
								inline: true,
							}
							embed.data.fields[2] = {
								name: instance.getMessage(guild, "DEALER_HAND", {
									CARDS: dealer_cards.join(" "),
								}),
								value: instance.getMessage(guild, "VALUE", {
									VALUE: Game.table.dealer.total,
								}),
								inline: true,
							}

							await i.update({
								embeds: [embed],
								components: [row],
							})
						}
					} else if (i.customId === "stand") {
						Game.stand()
						i.deferUpdate()
					} else {
						if ((await readFile(user.id, "falcoins")) >= bet) {
							await changeDB(user.id, "falcoins", -bet)
							Game.bet(bet * 2)
							Game.hit()
							Game.stand()
							i.deferUpdate()
						} else {
							i.reply({
								content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
								ephemeral: true,
							})
						}
					}
				})

				Game.on("end", async (results) => {
					collector.stop()
					double.setDisabled(true)
					hit.setDisabled(true)
					stand.setDisabled(true)

					var player_cards = []
					var dealer_cards = []

					results.player.cards.forEach((element) => {
						player_cards.push(enum_cards[element.name.substr(0, 2).trim()])
					})

					results.dealer.cards.forEach((element) => {
						dealer_cards.push(enum_cards[element.name.substr(0, 2).trim()])
					})

					embed.data.fields[1] = {
						name: instance.getMessage(guild, "PLAYER_HAND", {
							CARDS: player_cards.join(" "),
						}),
						value: instance.getMessage(guild, "VALUE", {
							VALUE: results.player.total,
						}),
						inline: true,
					}
					embed.data.fields[2] = {
						name: instance.getMessage(guild, "DEALER_HAND", {
							CARDS: dealer_cards.join(" "),
						}),
						value: instance.getMessage(guild, "VALUE", {
							VALUE: results.dealer.total,
						}),
						inline: true,
					}

					if (results.state === "draw") {
						embed.data.fields[0].value = instance.getMessage(
							guild,
							"BLACKJACK_DRAW",
							{ FALCOINS: format(results.bet) }
						)
						embed.setColor("Grey")
						await changeDB(user.id, "falcoins", results.bet)
					} else if (results.state === "player_blackjack") {
						embed.data.fields[0].value = instance.getMessage(
							guild,
							"PLAYER_BLACKJACK",
							{ FALCOINS: format(results.winnings) }
						)
						embed.setColor("Gold")
						await changeDB(user.id, "falcoins", results.bet + results.winnings)
					} else if (results.state === "player_win") {
						if (results.dealer.total > 21) {
							embed.data.fields[0].value = instance.getMessage(
								guild,
								"DEALER_BUST",
								{ FALCOINS: format(results.winnings) }
							)
						} else {
							embed.data.fields[0].value = instance.getMessage(
								guild,
								"YOU_WON",
								{ FALCOINS: format(results.winnings) }
							)
						}
						embed.setColor(3066993)
						await changeDB(user.id, "falcoins", results.bet + results.winnings)
					} else if (results.state === "dealer_win") {
						if (results.player.total > 21) {
							embed.data.fields[0].value = instance.getMessage(
								guild,
								"PLAYER_BUST",
								{ FALCOINS: format(results.losses) }
							)
						} else {
							embed.data.fields[0].value = instance.getMessage(
								guild,
								"YOU_LOST",
								{ FALCOINS: format(results.losses) }
							)
						}
						embed.setColor(15158332)
					} else {
						embed.data.fields[0].value = instance.getMessage(
							guild,
							"DEALER_BLACKJACK",
							{ FALCOINS: format(results.losses) }
						)
						embed.setColor("DarkRed")
					}

					embed.data.fields[0].value += `\n ${instance.getMessage(
						guild,
						"SALDO_ATUAL"
					)}: ${await readFile(user.id, "falcoins", true)} falcoins`

					await interaction.editReply({
						embeds: [embed],
						components: [row],
					})
				})

				collector.on("end", () => {
					if (collector.endReason) {
						Game.stand()
					}
				})
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "FALCOINS_INSUFICIENTES"),
				})
			}
		} catch (error) {
			console.error(`blackjack: ${error}`)
			interaction.editReply({
				content: instance.getMessage(guild, "EXCEPTION"),
				embeds: [],
				components: [],
			})
		}
	},
}
