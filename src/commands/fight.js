const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const {
	getMember,
	specialArg,
	readFile,
	format,
	randint,
	changeDB,
} = require("../utils/functions.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fight")
		.setDescription(
			"Challenge someone to a fight, whoever wins the fight gets the money"
		)
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("the user to challenge")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("falcoins")
				.setDescription(
					'the amount of falcoins to bet (supports "all"/"half" and things like 50.000, 20%, 10M, 25B)'
				)
				.setRequired(true)
		),
	execute: async ({ guild, interaction, user, member, instance }) => {
		await interaction.deferReply()
		try {
			falcoins = interaction.options.getString("falcoins")
			member2 = interaction.options.getUser("user")
			var member2 = await getMember(guild, member2.id)
			if (member2.user != user) {
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
				if (
					(await readFile(user.id, "falcoins")) >= bet &&
					(await readFile(member2.user.id, "falcoins")) >= bet &&
					bet > 0
				) {
					const row = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId("join")
							.setEmoji("✅")
							.setStyle("Success"),
						new ButtonBuilder()
							.setCustomId("refuse")
							.setEmoji("⛔")
							.setStyle("Danger"),
					])
					var answer = await interaction.editReply({
						content: instance.getMessage(guild, "LUTA_CONVITE", {
							USER: member,
							USER2: member2,
							FALCOINS: format(bet),
						}),
						components: [row],
						fetchReply: true,
					})

					const filter = (btInt) => {
						return btInt.user.id === member2.user.id
					}

					const collector = answer.createMessageComponentCollector({
						filter,
						max: 1,
						time: 1000 * 300,
					})

					collector.on("end", async (collected) => {
						if (collected.size === 0) {
							interaction.followUp({
								content: instance.getMessage(guild, "LUTA_CANCELADO_DEMOROU", {
									USER: member2,
								}),
							})
						} else if (collected.first().customId === "refuse") {
							interaction.followUp({
								content: instance.getMessage(guild, "LUTA_CANCELADO_RECUSOU", {
									USER: member2,
								}),
							})
						} else {
							await changeDB(user.id, "falcoins", -bet)
							await changeDB(member2.id, "falcoins", -bet)
							const attacks = [
								"instantâneo",
								"stun",
								"roubo de vida",
								"cura",
								"self",
								"escudo",
							]
							const player_1 = {
								hp: 100,
								name: member.displayName,
								stunned: false,
								mention: user,
								id: user.id,
								escudo: false,
							}
							const player_2 = {
								hp: 100,
								name: member2.displayName,
								stunned: false,
								mention: member2,
								id: member2.id,
								escudo: false,
							}
							const luck = Math.round(Math.random())
							if (luck === 0) {
								var order = [player_1, player_2]
							} else {
								var order = [player_2, player_1]
							}

							first = true
							while (order[0]["hp"] > 0 && order[1]["hp"] > 0) {
								for (let i = 0; i < order.length; i++) {
									if (order[0]["hp"] <= 0 || order[1]["hp"] <= 0) {
										break
									}

									if (order[i]["escudo"] === true) {
										order[i]["escudo"] = false
									}

									const attack = attacks[randint(0, attacks.length - 1)]
									const luck = randint(1, 50)

									if (i === 0) {
										var embed = new EmbedBuilder().setColor(3447003)
										var me = 0
										var enemy = 1
									} else {
										var embed = new EmbedBuilder().setColor(15105570)
										var me = 1
										var enemy = 0
									}

									field = {
										name: instance.getMessage(guild, "TURN", {
											USER: order[i]["name"],
										}),
										value: "",
									}

									if (order[i]["stunned"] === true) {
										order[i]["stunned"] = false
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "NOCAUTEADO")
									} else if (
										order[enemy]["escudo"] === true &&
										!["self", "escudo", "cura"].includes(attack)
									) {
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "TENTOU_ATACAR")
									} else if (attack === "instantâneo") {
										order[enemy]["hp"] -= luck
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "ATAQUE", {
												VALUE: luck,
											})
									} else if (attack === "stun") {
										order[enemy]["hp"] -= luck
										order[enemy]["stunned"] = true
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "ATAQUE_NOCAUTE", {
												VALUE: luck,
											})
									} else if (attack === "roubo de vida") {
										order[enemy]["hp"] -= luck
										order[me]["hp"] += luck
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "ROUBO_VIDA", {
												VALUE: luck,
											})
									} else if (attack === "cura") {
										order[i]["hp"] += luck
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "CURA", {
												VALUE: luck,
											})
									} else if (attack === "self") {
										order[i]["hp"] -= luck
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "SELF", {
												VALUE: luck,
											})
									} else if (attack === "escudo") {
										order[i]["escudo"] = true
										field.value =
											`${order[i]["mention"]} ` +
											instance.getMessage(guild, "SE_PROTEGE")
									}

									embed.addFields(field)

									if (order[i]["hp"] > 100) {
										order[i]["hp"] = 100
									}

									embed.addFields({
										name: "HP",
										value: `${order[0]["mention"]}: ${order[0]["hp"]} hp\n${order[1]["mention"]}: ${order[1]["hp"]} hp`,
									})

									if (first) {
										await collected.first().reply({
											embeds: [embed],
											components: [],
										})
										first = false
									} else {
										await interaction.channel.send({
											embeds: [embed],
										})
									}

									await new Promise((resolve) => setTimeout(resolve, 2500))
								}
							}

							const embed2 = new EmbedBuilder()
								.setColor(3066993)
								.setFooter({ text: "by Falcão ❤️" })
							if (order[0]["hp"] <= 0) {
								await changeDB(order[1]["id"], "falcoins", bet * 2)
								await changeDB(order[1]["id"], "vitorias")
								embed2.addFields(
									{
										name:
											`${order[1]["name"]}` +
											instance.getMessage(guild, "GANHO"),
										value: instance.getMessage(guild, "LUTA_DERROTOU", {
											USER: order[0]["mention"],
										}),
									},
									{
										name: instance.getMessage(guild, "SALDO_ATUAL"),
										value: `${await readFile(
											order[1]["id"],
											"falcoins",
											true
										)} falcoins`,
									}
								)
							} else if (order[1]["hp"] <= 0) {
								await changeDB(order[0]["id"], "falcoins", bet * 2)
								await changeDB(order[0]["id"], "vitorias")
								embed2.addFields(
									{
										name:
											`${order[0]["name"]}` +
											instance.getMessage(guild, "GANHO"),
										value: instance.getMessage(guild, "LUTA_DERROTOU", {
											USER: order[1]["mention"],
										}),
									},
									{
										name: instance.getMessage(guild, "SALDO_ATUAL"),
										value: `${await readFile(
											order[0]["id"],
											"falcoins",
											true
										)} falcoins`,
									}
								)
							}
							await interaction.channel.send({
								embeds: [embed2],
							})
						}
					})
				} else {
					await interaction.editReply({
						content: instance.getMessage(guild, "INSUFICIENTE_CONTAS"),
					})
				}
			} else {
				await interaction.editReply({
					content: instance.getMessage(guild, "NAO_JOGAR_SOZINHO"),
				})
			}
		} catch (error) {
			console.error(`fight: ${error}`)
			interaction.channel.send({
				content: instance.getMessage(guild, "EXCEPTION"),
			})
		}
	},
}
