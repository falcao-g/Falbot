const fs = require("fs")
const userSchema = require("../schemas/user-schema")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

async function createUser(id) {
	try {
		await userSchema.findByIdAndUpdate(
			id,
			{
				_id: id,
			},
			{
				upsert: true,
			}
		)
	} catch (error) {
		console.error(`Erro ao criar usuário: ${error}`)
	}
}

async function changeDB(id, field, quantity = 1, erase = false) {
	try {
		await createUser(id)
		if (erase == true) {
			await userSchema.findByIdAndUpdate(id, {
				[field]: quantity,
			})
		} else {
			await userSchema.findByIdAndUpdate(id, {
				$inc: {
					[field]: quantity,
				},
			})
		}
	} catch (error) {
		console.error(`Erro ao mudar a database: ${error}`)
	}
}

async function takeAndGive(id, id2, field, field2, quantity = 1) {
	try {
		await createUser(id)
		await createUser(id2)
		await userSchema.findByIdAndUpdate(id, { $inc: { [field]: -quantity } })
		await userSchema.findByIdAndUpdate(id2, { $inc: { [field2]: quantity } })
	} catch {
		console.error(`Erro ao alterar a database no takeAndGive: ${error}`)
	}
}

async function msToTime(ms) {
	let time = ""

	let n = 0
	if (ms >= 31536000000) {
		n = Math.floor(ms / 31536000000)
		time = `${n}y `
		ms -= n * 31536000000
	}

	if (ms >= 2592000000) {
		n = Math.floor(ms / 2592000000)
		time += `${n}mo `
		ms -= n * 2592000000
	}

	if (ms >= 604800000) {
		n = Math.floor(ms / 604800000)
		time += `${n}w `
		ms -= n * 604800000
	}

	if (ms >= 86400000) {
		n = Math.floor(ms / 86400000)
		time += `${n}d `
		ms -= n * 86400000
	}

	if (ms >= 3600000) {
		n = Math.floor(ms / 3600000)
		time += `${n}h `
		ms -= n * 3600000
	}

	if (ms >= 60000) {
		n = Math.floor(ms / 60000)
		time += `${n}m `
		ms -= n * 60000
	}

	n = Math.ceil(ms / 1000)
	time += n === 0 ? "" : `${n}s`

	return time.trimEnd()
}

async function specialArg(arg, id, field = "falcoins") {
	await createUser(id)
	var user = await userSchema.findById(id)

	arg = arg.toString()
	arg = arg.toLowerCase()

	new_arg = ""
	for (c in arg) {
		if (arg[c] != "." && arg[c] != ",") {
			new_arg += arg[c]
		}
	}

	if (new_arg == "tudo" || new_arg == "all") {
		new_arg = user[field]
	} else if (new_arg == "metade" || new_arg == "half") {
		new_arg = parseInt(user[field] / 2)
	} else if (new_arg.slice(-1) === "m") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000"
	} else if (new_arg.slice(-1) === "b") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000000"
	} else if (new_arg.slice(-1) === "t") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000000000000"
	} else {
		for (c in new_arg) {
			if (new_arg[c] == "%") {
				new_arg = parseInt(
					(parseInt(new_arg.slice(0, -1)) * parseInt(user[field])) / 100
				)
			}
		}
	}
	if (parseInt(new_arg) < 0 || isNaN(parseInt(new_arg))) {
		throw Error("Argumento inválido!")
	} else {
		return parseInt(new_arg)
	}
}

async function format(falcoins) {
	if (parseInt(falcoins) < 0) {
		falcoins = falcoins.toString()
		pop = falcoins.slice(1)
	} else {
		pop = falcoins.toString()
	}
	pop_reverse = pop.split("").reverse().join("")
	pop_2 = ""
	for (c in pop_reverse) {
		if (c / 3 == parseInt(c / 3) && c / 3 != 0) {
			pop_2 += "."
			pop_2 += pop_reverse[c]
		} else {
			pop_2 += pop_reverse[c]
		}
	}
	return pop_2.split("").reverse().join("")
}

async function readFile(id, field = "", rich = false) {
	try {
		await createUser(id)

		if (field == "") {
			return await userSchema.findById(id)
		} else if (rich == false) {
			return (await userSchema.findById(id))[field]
		} else {
			return await format((await userSchema.findById(id))[field])
		}
	} catch (error) {
		console.error(`Erro ao ler arquivo: ${error}`)
	}
}

async function getRoleColor(guild, member_id) {
	try {
		cor = guild.members.cache.get(member_id).displayColor
		return cor
	} catch (err) {
		return "RANDOM"
	}
}

async function getMember(guild, member_id) {
	return guild.members.cache.get(member_id)
}

async function count(array, string) {
	var amount = 0
	for (let i = 0; i <= array.length; i++) {
		if (array[i - 1] === string) {
			amount += 1
		}
	}
	return amount
}

function randint(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low)
}

async function bankInterest() {
	var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"))
	if (
		Date.now() - config["poupanca"]["last_interest"] >
		config["poupanca"]["interest_time"]
	) {
		console.log("poupança!")
		config["poupanca"]["last_interest"] = Date.now().toString()

		var users = await userSchema.find({
			banco: { $gt: 0 },
		})

		for (user of users) {
			if (user.limite_banco > user.banco) {
				user.banco += Math.floor(
					parseInt(user.banco * parseFloat(config["poupanca"]["interest_rate"]))
				)
			}

			if (user.banco > user.limite_banco) {
				user.banco = user.limite_banco
			}

			user.save()
		}

		json2 = JSON.stringify(config, null, 1)

		fs.writeFileSync("./src/config.json", json2, "utf8", function (err) {
			if (err) throw err
		})
	}
}

async function sendVoteReminders(instance, client) {
	try {
		var users = await userSchema.find({
			voteReminder: true,
		})

		for (user of users) {
			//send dm reminder vote if user wants to
			if (
				Date.now() - user.lastVote > 43200000 &&
				user.lastReminder <= user.lastVote
			) {
				discordUser = await client.users.fetch(user._id)
				const embed = new MessageEmbed()
					.setColor("YELLOW")
					.addField(
						instance.messageHandler.get(discordUser, "VOTE_REMINDER"),
						instance.messageHandler.get(discordUser, "REWARD_AFTER")
					)
					.addField("Link", "https://top.gg/bot/742331813539872798/vote", false)
					.setFooter({ text: "by Falcão ❤️" })

				const row = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("disableVoteReminder")
						.setLabel(
							instance.messageHandler.get(discordUser, "DISABLE_REMINDER")
						)
						.setEmoji("🔕")
						.setStyle("DANGER")
				)

				await discordUser.send({
					embeds: [embed],
					components: [row],
				})

				user.lastReminder = Date.now()
				user.save()
			}
		}
	} catch (err) {
		console.log(`Sending reminders: ${err}`)
	}
}

async function lotteryDraw(instance, client) {
	var config = JSON.parse(fs.readFileSync("./src/config.json", "utf8"))
	if (Date.now() > config["lottery"]["drawTime"]) {
		console.log("loteria!")

		var users = await userSchema.find({
			tickets: { $gt: 0 },
		})

		if (users.length > 0) {
			var numTickets = 0
			for (user of users) {
				numTickets += user.tickets
			}

			var winner
			while (winner === undefined) {
				for (user of users) {
					if (randint(1, numTickets) <= user.tickets) {
						winner = user
					}
				}
			}

			await changeDB(winner.id, "falcoins", config["lottery"]["prize"])

			winnerUser = await client.users.fetch(winner.id)

			const embed = new MessageEmbed()
				.setColor("GOLD")
				.addField(
					instance.messageHandler.get(winnerUser, "CONGRATULATIONS"),
					instance.messageHandler.get(winnerUser, "LOTTERY_WIN", {
						PRIZE: await format(config["lottery"]["prize"]),
						TICKETS: await format(winner.tickets),
						TOTAL: await format(numTickets),
					})
				)
				.setFooter({ text: "by Falcão ❤️" })

			await userSchema.updateMany(
				{
					tickets: { $gt: 0 },
				},
				{
					tickets: 0,
				}
			)

			await winnerUser.send({
				embeds: [embed],
			})
		}
		config["lottery"]["drawTime"] = Date.now() + 604800000 //next one is next wee
		config["lottery"]["prize"] = randint(1000000, 2000000)

		json2 = JSON.stringify(config, null, 1)

		fs.writeFileSync("./src/config.json", json2, "utf8", function (err) {
			if (err) throw err
		})
	}
}

async function rankPerks(rank, instance, guild) {
	perks = ""

	if (rank.perks.includes("bank")) {
		perks += instance.messageHandler.get(guild, "RANKUP_BANK")
	} else if (rank.perks.includes("caixa")) {
		perks += instance.messageHandler.get(guild, "RANKUP_CAIXA")
	} else if (rank.perks.includes("lootbox")) {
		perks += instance.messageHandler.get(guild, "RANKUP_LOOTBOX")
	} else if (rank.perks.includes("none")) {
		perks += instance.messageHandler.get(guild, "RANKUP_NONE")
	}

	return perks
}

async function paginate() {
	const __embeds = []
	let cur = 0
	let traverser
	let message
	return {
		add(...embeds) {
			__embeds.push(...embeds)
			return this
		},
		setTraverser(tr) {
			traverser = tr
		},
		setMessage(_message) {
			message = _message
		},
		async next() {
			cur++
			if (cur >= __embeds.length) {
				cur = 0
			}
		},
		async back() {
			cur--
			if (cur <= -__embeds.length) {
				cur = 0
			}
		},
		at(num) {
			return __embeds.at(num)
		},
		components() {
			return {
				embeds: [__embeds.at(cur)],
				components: [
					new MessageActionRow().addComponents(traverser[0], traverser[1]),
				],
				fetchReply: true,
			}
		},
	}
}

module.exports = {
	createUser,
	changeDB,
	msToTime,
	specialArg,
	format,
	readFile,
	getRoleColor,
	getMember,
	takeAndGive,
	count,
	randint,
	bankInterest,
	rankPerks,
	sendVoteReminders,
	paginate,
	lotteryDraw,
}
