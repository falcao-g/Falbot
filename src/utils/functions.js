const userSchema = require("../schemas/user-schema")
const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const items = require("./json/items.json")

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

function msToTime(ms) {
	let time = ""

	let n = 0
	if (ms >= 2592000000) {
		n = Math.floor(ms / 2592000000)
		time += `${n}m `
		ms -= n * 2592000000
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

	if (time === "") time += "1m"

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
	} else if (new_arg.slice(-1) === "k") {
		new_arg = new_arg.slice(0, -1)
		new_arg += "000"
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
				new_arg = parseInt((parseInt(new_arg.slice(0, -1)) * parseInt(user[field])) / 100)
			}
		}
	}
	if (parseInt(new_arg) <= 0 || isNaN(parseInt(new_arg))) {
		throw Error("Invalid value!")
	} else {
		return parseInt(new_arg)
	}
}

function format(falcoins) {
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
		return "Random"
	}
}

function count(array, string) {
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

function paginate() {
	const __embeds = []
	let cur = 0
	let traverser
	return {
		add(...embeds) {
			__embeds.push(...embeds)
			return this
		},
		setTraverser(tr) {
			traverser = tr
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
		components() {
			return {
				embeds: [__embeds.at(cur)],
				components: [new ActionRowBuilder().addComponents(...traverser)],
				fetchReply: true,
			}
		},
	}
}

function pick(data) {
	// Split input into two separate arrays of values and weights.
	const values = data.map((d) => d[0])
	const weights = data.map((d) => d[1])

	let acc = 0
	const sum = weights.reduce((acc, element) => acc + element, 0)
	const weightsSum = weights.map((element) => {
		acc = element + acc
		return acc
	})
	const rand = Math.random() * sum

	return values[weightsSum.filter((element) => element <= rand).length]
}

async function setCooldown(id, command, cooldown) {
	var cooldowns = (await userSchema.findById(id)).cooldowns
	cooldowns.set(command, Date.now() + cooldown * 1000)
	await changeDB(id, "cooldowns", cooldowns, true)
}

async function resolveCooldown(id, command) {
	var cooldowns = (await userSchema.findById(id)).cooldowns
	var commandField = cooldowns.get(command)
	if (commandField != undefined) {
		if (commandField > Date.now()) {
			return commandField - Date.now()
		} else {
			cooldowns.set(command, 0)
			await changeDB(id, "cooldowns", cooldowns, true)
		}
	}
	return 0
}

function getItem(item) {
	for (const key in items) {
		if (
			items[key]["pt-BR"].split(" ").slice(1).join(" ").toLowerCase() === item ||
			items[key]["en-US"].split(" ").slice(1).join(" ").toLowerCase() === item
		) {
			return key
		}
	}

	if (items[item] != undefined) {
		return item
	}
}

function buttons(buttons) {
	const row = new ActionRowBuilder()

	const buttonsEnum = {
		cooldowns: new ButtonBuilder().setCustomId("cooldowns").setEmoji("⏱️").setStyle("Secondary"),
		help: new ButtonBuilder().setCustomId("help").setEmoji("📚").setStyle("Secondary"),
		accept: new ButtonBuilder().setCustomId("accept").setEmoji("✅").setStyle("Success"),
		skip: new ButtonBuilder().setCustomId("skip").setEmoji("▶️").setStyle("Secondary"),
		refuse: new ButtonBuilder().setCustomId("refuse").setEmoji("⛔").setStyle("Danger"),
		inventory_view: new ButtonBuilder().setCustomId("inventory view").setEmoji("🎒").setStyle("Secondary"),
		balance: new ButtonBuilder().setCustomId("balance").setEmoji("🪙").setStyle("Secondary"),
	}

	for (button of buttons) {
		row.addComponents([buttonsEnum[button]])
	}

	return row
}

async function isEquipped(member, item) {
	const equippedItems = await readFile(member.id, "equippedItems")

	for (itemEquipped of equippedItems) {
		if (itemEquipped.name === item) {
			return true
		}
	}
}

async function useItem(member, item) {
	var equippedItems = await readFile(member.id, "equippedItems")

	for (itemEquipped of equippedItems) {
		if (itemEquipped.name === item) {
			itemEquipped.usageCount -= 1
			if (itemEquipped.usageCount === 0) {
				equippedItems = equippedItems.filter((equipped) => {
					return equipped.name != item
				})
			}
		}
	}

	await changeDB(member.id, "equippedItems", equippedItems, true)
}

module.exports = {
	createUser,
	changeDB,
	msToTime,
	specialArg,
	format,
	readFile,
	getRoleColor,
	count,
	randint,
	paginate,
	pick,
	setCooldown,
	getItem,
	buttons,
	isEquipped,
	useItem,
	resolveCooldown,
}
